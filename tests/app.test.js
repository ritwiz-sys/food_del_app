const request = require('supertest');
const app = require('../src/app');

describe('Food delivery API', () => {
  test('GET /health returns an UP status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'UP' });
  });

  test('GET /restaurants returns the available restaurants', async () => {
    const response = await request(app).get('/restaurants');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Spice Hub', cuisine: 'Indian' },
      { id: 2, name: 'Pizza Point', cuisine: 'Italian' }
    ]);
  });

  test('GET /restaurants/:id/menu returns a restaurant menu', async () => {
    const response = await request(app).get('/restaurants/1/menu');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Paneer Tikka', price: 12.99 },
      { id: 2, name: 'Chicken Biryani', price: 15.99 }
    ]);
  });

  test('GET /restaurants/:id/menu returns 404 for an unknown restaurant', async () => {
    const response = await request(app).get('/restaurants/999/menu');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Restaurant not found' });
  });

  test('POST /orders creates and returns a placed order', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ restaurantId: 1, items: [{ itemId: 1, quantity: 2 }] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      restaurantId: 1,
      items: [{ itemId: 1, quantity: 2 }],
      status: 'PLACED'
    });
  });

  test('POST /orders returns 400 when restaurantId is missing', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ items: [{ itemId: 1, quantity: 1 }] });

    expect(response.status).toBe(400);
  });

  test('POST /orders returns 400 when items are missing or empty', async () => {
    const missingItems = await request(app)
      .post('/orders')
      .send({ restaurantId: 1 });
    const emptyItems = await request(app)
      .post('/orders')
      .send({ restaurantId: 1, items: [] });

    expect(missingItems.status).toBe(400);
    expect(emptyItems.status).toBe(400);
  });

  test('GET /orders/:id returns an order and 404 for an unknown order', async () => {
    const orderResponse = await request(app).get('/orders/1');
    const missingResponse = await request(app).get('/orders/999');

    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body).toMatchObject({
      id: 1,
      restaurantId: 1,
      status: 'PLACED'
    });
    expect(missingResponse.status).toBe(404);
    expect(missingResponse.body).toEqual({ error: 'Order not found' });
  });
});
