# Movies API

RESTful API for Movies (CRUD) + Reviews, built with Express.

Data is persisted in **MongoDB** via Mongoose.

Production middleware: dotenv, helmet, morgan + winston, express-rate-limit, and Swagger docs.

## Run

```bash
npm install
# make sure MongoDB is running (default: mongodb://127.0.0.1:27017/moviesdb)
npm run seed     # optional: load sample movies + reviews
npm run dev      # nodemon, or: npm start
# -> http://localhost:3000
```

The server connects to MongoDB first, then starts listening. Data survives restarts.

CORS is enabled, so a frontend page can call the API directly.

## Project structure

Layered architecture (separation of concerns):

```
src/
  routes/       route definitions (path + method -> controller)
  controllers/  request handling (read req, call model, send res)
  models/       data operations (search / sort / paginate / CRUD)
  middleware/   cors, logger, 404, error handler
  app.js        assembles the express app
server.js       starts the server
```

## Middleware stack

| Package | Purpose |
|---------|---------|
| `dotenv` | Load config from `.env` |
| `helmet` | Security HTTP headers |
| `morgan` + `winston` | HTTP request logging -> terminal + `logs/app.log` |
| `express-rate-limit` | Throttle requests per IP (returns 429) |
| `cors` | Allow the frontend to call the API |
| `swagger-ui-express` + `swagger-jsdoc` | Interactive API docs |

## API docs (Swagger)

Start the server, then open:

```
http://localhost:3000/api-docs        # Swagger UI
http://localhost:3000/api-docs.json    # raw OpenAPI spec
```

## Environment variables

Copy `.env.example` to `.env` (already has sensible defaults, app also works without it):

| Var | Default | Meaning |
|-----|---------|---------|
| `NODE_ENV` | development | dev = pretty logs, prod = JSON logs |
| `PORT` | 3000 | Server port |
| `MONGODB_URI` | mongodb://127.0.0.1:27017/moviesdb | MongoDB connection string |
| `LOG_LEVEL` | info | winston log level |
| `RATE_LIMIT_WINDOW_MS` | 900000 | Rate-limit window (15 min) |
| `RATE_LIMIT_MAX` | 100 | Max requests per window per IP |

## Endpoints

Base path: `/v1`

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | GET | `/v1/movies` | List movies. Supports `keyword` search, `sort`, pagination |
| 2 | GET | `/v1/movies/:id` | Get one movie |
| 3 | POST | `/v1/movies` | Create a movie |
| 4 | PUT | `/v1/movies/:id` | Update a movie |
| 5 | DELETE | `/v1/movies/:id` | Delete a movie |
| 6 | GET | `/v1/movies/:id/reviews` | List reviews of a movie |
| 7 | POST | `/v1/movies/:id/reviews` | Add a review to a movie |

### GET /v1/movies — query params

| Param | Example | Meaning |
|-------|---------|---------|
| `keyword` | `nolan` | Case-insensitive match on title / genre / director |
| `sort` | `-rating` | Sort by `rating` / `year` / `title`. Leading `-` = descending |
| `page` | `1` | Page number (default 1) |
| `limit` | `10` | Page size (default 10) |

Response:

```json
{
  "data": [ /* movies */ ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

## Testing (Postman / Newman)

`postman/collections/movies-api.postman_collection.json` covers **every endpoint** with
normal + error scenarios (18 requests, 45 assertions). Each request asserts the status
code and response body. It creates its own movie/review, exercises them, then cleans up.

Run in Postman (import the file and hit "Run"), or from the CLI with Newman:

```bash
npm run dev        # start the API (MongoDB must be running) in one terminal
npm run test:api   # newman run the collection in another
```

Scenarios covered:

| Type | Cases |
|------|-------|
| Happy path | health, create, list, search+sort+paginate, get by id, update, add review, list reviews |
| Errors | missing id -> 404, invalid ObjectId -> 404, no title -> 400, update missing -> 404, rating out of range -> 400, missing rating -> 400, reviews for missing movie -> 404, unknown route -> 404 |
| Cleanup | delete -> 204, then get -> 404 |

## Data models

```
Movie  { id, title, genre, year, rating, director }
Review { id, movieId, author, rating (1-5), comment, createdAt }
```

## Status codes

| Situation | Status |
|-----------|--------|
| Success (GET/PUT) | 200 |
| Created (POST) | 201 |
| Deleted | 204 |
| Bad input (missing/invalid field) | 400 |
| Movie not found | 404 |

Data is stored in MongoDB and persists across restarts. Each document's `id` is a Mongo ObjectId string (exposed as `id`, not `_id`).

## Postman

Import `postman/collections/movies-api.postman_collection.json`. It runs the full flow
(create → read → update → review → delete) and auto-captures the new movie id into a
collection variable.
