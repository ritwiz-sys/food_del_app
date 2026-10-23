const express = require('express');

const app = express();

app.use(express.json());

const restaurants = [
  {
    id: 1,
    name: 'Spice Hub',
    cuisine: 'Indian',
    menu: [
      { id: 1, name: 'Paneer Tikka', price: 12.99 },
      { id: 2, name: 'Chicken Biryani', price: 15.99 }
    ]
  },
  {
    id: 2,
    name: 'Pizza Point',
    cuisine: 'Italian',
    menu: [
      { id: 1, name: 'Margherita Pizza', price: 13.99 },
      { id: 2, name: 'Pasta Alfredo', price: 14.99 }
    ]
  }
];

const restaurantList = restaurants.map(({ id, name, cuisine }) => ({
  id,
  name,
  cuisine
}));
const orders = new Map();
let nextOrderId = 1;

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/restaurants', (req, res) => {
  res.json(restaurantList);
});

app.get('/restaurants/:id/menu', (req, res) => {
  const restaurant = restaurants.find((entry) => entry.id === Number(req.params.id));

  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  return res.json(restaurant.menu);
});

app.post('/orders', (req, res) => {
  const { restaurantId, items } = req.body || {};

  if (!restaurantId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'restaurantId and a non-empty items array are required' });
  }

  const order = {
    id: nextOrderId++,
    restaurantId,
    items,
    status: 'PLACED'
  };

  orders.set(order.id, order);
  return res.status(201).json(order);
});

// Retrieve a previously placed order by ID.
app.get('/orders/:id', (req, res) => {
  const order = orders.get(Number(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.json(order);
});

module.exports = app;
