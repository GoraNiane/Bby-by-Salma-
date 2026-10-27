import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const customersRouter = express.Router();

customersRouter.get('/', requireAuth, (req, res) => {
  try {
    let customers = [...db.getData().customers];
    const { search } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }

    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

customersRouter.get('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const customer = db.getData().customers.find(c => c.id === id);

    if (!customer) return res.status(404).json({ error: 'Client introuvable.' });

    const cleanPhone = customer.phone.replace(/\D/g, '');
    const orders = db.getData().orders.filter(o => 
      o.customer.phone.replace(/\D/g, '') === cleanPhone
    );

    res.json({ ...customer, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

customersRouter.post('/', requireAuth, (req, res) => {
  try {
    const { name, phone, email, address, city } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Nom et téléphone obligatoires.' });

    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      address: address?.trim(),
      city: city?.trim() || 'Dakar',
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    db.getData().customers.unshift(newCustomer);
    db.save();

    res.status(201).json({ success: true, customer: newCustomer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { customersRouter };
