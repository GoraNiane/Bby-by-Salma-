import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const ordersRouter = express.Router();

ordersRouter.get('/track/:orderNumber', (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    const order = db.getData().orders.find(o => 
      o.orderNumber.toLowerCase() === orderNumber.toLowerCase() ||
      o.id.toLowerCase() === orderNumber.toLowerCase()
    );

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable.' });
    }

    if (phone && typeof phone === 'string') {
      const cleanInputPhone = phone.replace(/\D/g, '');
      const cleanOrderPhone = order.customer.phone.replace(/\D/g, '');
      if (!cleanOrderPhone.includes(cleanInputPhone) && !cleanInputPhone.includes(cleanOrderPhone)) {
        return res.status(403).json({ error: 'Téléphone non correspondant.' });
      }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

ordersRouter.get('/', requireAuth, (req, res) => {
  try {
    let orders = [...db.getData().orders];
    const { status, search } = req.query;

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q)
      );
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

ordersRouter.get('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const order = db.getData().orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return res.status(404).json({ error: 'Commande introuvable.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

ordersRouter.post('/', (req, res) => {
  try {
    const { customer, items, paymentMethod = 'cash_on_delivery', deliveryFee = 2000, discount = 0 } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ error: 'Informations de livraison incomplètes.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide.' });
    }

    const validatedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = db.getData().products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Produit introuvable : ${item.name || item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour "${product.name}". Il reste ${product.stock} pièce(s).`
        });
      }

      product.stock -= item.quantity;
      product.updatedAt = new Date().toISOString();

      const unitPrice = product.promoPrice || product.price;
      calculatedSubtotal += unitPrice * item.quantity;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: item.quantity,
        shade: item.shade || product.shade,
        image: product.images[0]?.url || '/assets/prod_fond_teint.jpg',
        sku: product.sku
      });
    }

    const nextOrderSeq = db.getData().orders.length + 126;
    const orderNumber = `BBS-${nextOrderSeq.toString().padStart(5, '0')}`;
    const total = Math.max(0, calculatedSubtotal + Number(deliveryFee) - Number(discount));

    const newOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : undefined,
        address: customer.address.trim(),
        city: customer.city ? customer.city.trim() : 'Dakar',
        region: customer.region ? customer.region.trim() : 'Dakar',
        notes: customer.notes ? customer.notes.trim() : undefined
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee: Number(deliveryFee),
      discount: Number(discount),
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      orderStatus: 'new',
      history: [
        {
          status: 'new',
          date: new Date().toISOString(),
          note: `Nouvelle commande enregistrée (${paymentMethod === 'cash_on_delivery' ? 'Paiement à la livraison' : paymentMethod.toUpperCase()})`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.getData().orders.unshift(newOrder);

    const existingCustomer = db.getData().customers.find(c => 
      c.phone.replace(/\D/g, '') === customer.phone.replace(/\D/g, '')
    );

    if (existingCustomer) {
      existingCustomer.ordersCount += 1;
      existingCustomer.totalSpent += total;
      existingCustomer.lastOrderDate = new Date().toISOString();
      if (customer.address) existingCustomer.address = customer.address;
    } else {
      const newCustomer = {
        id: `cust_${Date.now()}`,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim(),
        address: customer.address.trim(),
        city: customer.city?.trim() || 'Dakar',
        ordersCount: 1,
        totalSpent: total,
        lastOrderDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      db.getData().customers.unshift(newCustomer);
    }

    db.save();

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès !',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

ordersRouter.put('/:id/status', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, paymentStatus } = req.body;

    const order = db.getData().orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'Commande introuvable.' });

    const previousStatus = order.orderStatus;

    if (status && status !== previousStatus) {
      if (status === 'cancelled' && previousStatus !== 'cancelled') {
        for (const item of order.items) {
          const product = db.getData().products.find(p => p.id === item.productId);
          if (product) {
            product.stock += item.quantity;
            product.updatedAt = new Date().toISOString();
          }
        }
      }

      order.orderStatus = status;
      order.history.push({
        status,
        date: new Date().toISOString(),
        note: note || `Statut passé à : ${status}`
      });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;

    order.updatedAt = new Date().toISOString();
    db.save();

    res.json({
      success: true,
      message: 'Statut mis à jour.',
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { ordersRouter };
