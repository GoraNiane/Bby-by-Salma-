import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const salesRouter = express.Router();

salesRouter.get('/', requireAuth, (req, res) => {
  try {
    const orders = db.getData().orders;
    const products = db.getData().products;
    const collections = db.getData().collections;
    const customers = db.getData().customers;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.getTime() - (now.getDay() || 7 - 1) * 86400 * 1000).setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const validOrders = orders.filter(o => o.orderStatus !== 'cancelled');

    let totalRevenue = 0;
    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;
    let todayOrdersCount = 0;
    let weekOrdersCount = 0;
    let monthOrdersCount = 0;
    let totalProductsSold = 0;

    const productSalesMap = {};
    const collectionSalesMap = {};

    validOrders.forEach(order => {
      const orderTime = new Date(order.createdAt).getTime();
      totalRevenue += order.total;

      if (orderTime >= startOfToday) {
        todayRevenue += order.total;
        todayOrdersCount++;
      }
      if (orderTime >= startOfWeek) {
        weekRevenue += order.total;
        weekOrdersCount++;
      }
      if (orderTime >= startOfMonth) {
        monthRevenue += order.total;
        monthOrdersCount++;
      }

      order.items.forEach(item => {
        totalProductsSold += item.quantity;

        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            sku: item.sku,
            count: 0,
            revenue: 0,
            image: item.image
          };
        }
        productSalesMap[item.productId].count += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;

        const prod = products.find(p => p.id === item.productId);
        if (prod && prod.collectionId) {
          const col = collections.find(c => c.id === prod.collectionId);
          const colName = col ? col.name : 'Gamme Inconnue';
          if (!collectionSalesMap[prod.collectionId]) {
            collectionSalesMap[prod.collectionId] = {
              name: colName,
              count: 0,
              revenue: 0
            };
          }
          collectionSalesMap[prod.collectionId].count += item.quantity;
          collectionSalesMap[prod.collectionId].revenue += item.price * item.quantity;
        }
      });
    });

    const averageCart = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
    const lowStockProducts = products.filter(p => p.stock <= p.alertThreshold && p.stock > 0);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const topCollections = Object.values(collectionSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const last7DaysChart = [];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400 * 1000);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400 * 1000;

      const dayOrders = validOrders.filter(o => {
        const t = new Date(o.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      });

      const dayRev = dayOrders.reduce((sum, o) => sum + o.total, 0);

      last7DaysChart.push({
        label: dayNames[d.getDay()],
        date: d.toISOString().split('T')[0],
        revenue: dayRev,
        ordersCount: dayOrders.length
      });
    }

    const ordersByStatus = {
      new: orders.filter(o => o.orderStatus === 'new').length,
      confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
      processing: orders.filter(o => o.orderStatus === 'processing').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'cancelled').length
    };

    res.json({
      summary: {
        totalRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        totalOrders: orders.length,
        validOrdersCount: validOrders.length,
        todayOrdersCount,
        weekOrdersCount,
        monthOrdersCount,
        totalProductsSold,
        totalProductsInCatalog: products.length,
        averageCart,
        customersCount: customers.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length
      },
      lowStockProducts,
      outOfStockProducts,
      topProducts,
      topCollections,
      last7DaysChart,
      ordersByStatus,
      recentOrders: orders.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { salesRouter };
