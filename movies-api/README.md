# Movies API

RESTful API for Movies (CRUD) + Reviews, built with Express.

## Run

```bash
npm install
npm run dev      # nodemon, or: npm start
# -> http://localhost:3000
```

CORS is enabled, so a frontend page can call the API directly.

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

Data is in-memory and resets when the server restarts.

## Postman

Import `postman/collections/movies-api.postman_collection.json`. It runs the full flow
(create → read → update → review → delete) and auto-captures the new movie id into a
collection variable.
