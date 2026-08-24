// console.log('Hello World');

const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);

    res.end('Hello World')
})

server.listen(3000, () => {
    console.log('Server listening on port 3000');
})