# Food Delivery API

A Node.js 20 and Express REST API for an online food delivery application. This DevOps case study uses in-memory restaurant, menu, and order data, so orders are reset whenever the server restarts.

## Run locally

```sh
npm install
npm start
```

The API listens on port `3000` by default. Set `PORT` to use another port.

## Test

```sh
npm test
```

Jest runs the API tests with Supertest and writes coverage output to `coverage/`.

## Docker

```sh
docker build -t food-delivery-app .
docker run --rm -p 3000:3000 food-delivery-app
```

The container exposes port `3000` and checks its health at `/health`.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns the API health status. |
| `GET` | `/restaurants` | Lists available restaurants. |
| `GET` | `/restaurants/:id/menu` | Lists a restaurant's menu; returns `404` for an unknown restaurant. |
| `POST` | `/orders` | Places an order with `{ "restaurantId": 1, "items": [{ "itemId": 1, "quantity": 2 }] }`; returns `201`. Missing restaurant IDs or empty/missing item arrays return `400`. |
| `GET` | `/orders/:id` | Retrieves an order; returns `404` for an unknown order. |

## CI/CD

GitHub Actions runs build verification and tests on pushes and pull requests targeting `main` or `develop`. Pushes also build and smoke-test the Docker image. Successful pushes to `develop` and `main` run the staging and production deployment placeholder jobs, respectively.
