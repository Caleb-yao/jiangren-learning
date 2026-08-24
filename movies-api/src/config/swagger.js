// OpenAPI 3.0 spec, assembled with swagger-jsdoc. Served by swagger-ui-express at /api-docs.
const swaggerJSDoc = require('swagger-jsdoc');
const { port } = require('./env');

const movieSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer', example: 1 },
        title: { type: 'string', example: 'Inception' },
        genre: { type: 'string', example: 'Sci-Fi' },
        year: { type: 'integer', example: 2010 },
        rating: { type: 'number', example: 8.8 },
        director: { type: 'string', example: 'Christopher Nolan' },
    },
};

const reviewSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer', example: 1 },
        movieId: { type: 'integer', example: 1 },
        author: { type: 'string', example: 'Alice' },
        rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
        comment: { type: 'string', example: 'Mind-blowing.' },
        createdAt: { type: 'string', format: 'date-time' },
    },
};

const movieInput = {
    type: 'object',
    required: ['title'],
    properties: {
        title: { type: 'string', example: 'Dune' },
        genre: { type: 'string', example: 'Sci-Fi' },
        year: { type: 'integer', example: 2021 },
        rating: { type: 'number', example: 8.0 },
        director: { type: 'string', example: 'Denis Villeneuve' },
    },
};

const reviewInput = {
    type: 'object',
    required: ['author', 'rating'],
    properties: {
        author: { type: 'string', example: 'Dan' },
        rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
        comment: { type: 'string', example: 'Epic!' },
    },
};

const errorSchema = {
    type: 'object',
    properties: { error: { type: 'string', example: 'Movie not found' } },
};

const idParam = {
    name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Movie id',
};

const definition = {
    openapi: '3.0.0',
    info: {
        title: 'Movies API',
        version: '2.1.0',
        description:
            'RESTful Movies CRUD + Reviews API. Layered architecture with dotenv, helmet, morgan+winston, rate limiting and Swagger docs.',
    },
    servers: [{ url: `http://localhost:${port}`, description: 'Local server' }],
    tags: [
        { name: 'Movies', description: 'Movie CRUD + search/sort/pagination' },
        { name: 'Reviews', description: 'Reviews nested under a movie' },
    ],
    components: {
        schemas: {
            Movie: movieSchema,
            Review: reviewSchema,
            MovieInput: movieInput,
            ReviewInput: reviewInput,
            Error: errorSchema,
        },
    },
    paths: {
        '/v1/movies': {
            get: {
                tags: ['Movies'],
                summary: 'List movies (keyword search, sort, pagination)',
                parameters: [
                    { name: 'keyword', in: 'query', schema: { type: 'string' }, description: 'Match title / genre / director' },
                    { name: 'sort', in: 'query', schema: { type: 'string', example: '-rating' }, description: 'rating | year | title; prefix "-" for descending' },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                ],
                responses: {
                    200: {
                        description: 'A paginated list of movies',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { type: 'array', items: { $ref: '#/components/schemas/Movie' } },
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                page: { type: 'integer' }, limit: { type: 'integer' },
                                                total: { type: 'integer' }, totalPages: { type: 'integer' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Movies'],
                summary: 'Create a movie',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MovieInput' } } } },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } },
                    400: { description: 'title is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/v1/movies/{id}': {
            get: {
                tags: ['Movies'], summary: 'Get a movie by id', parameters: [idParam],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } },
                    404: { description: 'Movie not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
            put: {
                tags: ['Movies'], summary: 'Update a movie', parameters: [idParam],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MovieInput' } } } },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } },
                    404: { description: 'Movie not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
            delete: {
                tags: ['Movies'], summary: 'Delete a movie', parameters: [idParam],
                responses: {
                    204: { description: 'Deleted (no content)' },
                    404: { description: 'Movie not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/v1/movies/{id}/reviews': {
            get: {
                tags: ['Reviews'], summary: 'List reviews of a movie', parameters: [idParam],
                responses: {
                    200: {
                        description: 'Reviews with average rating',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        movieId: { type: 'integer' }, count: { type: 'integer' },
                                        averageRating: { type: 'number' },
                                        data: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
                                    },
                                },
                            },
                        },
                    },
                    404: { description: 'Movie not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
            post: {
                tags: ['Reviews'], summary: 'Add a review to a movie', parameters: [idParam],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReviewInput' } } } },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } } },
                    400: { description: 'Invalid input', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Movie not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
    },
};

module.exports = swaggerJSDoc({ definition, apis: [] });
