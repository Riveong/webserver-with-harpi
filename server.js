const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
    });

    server.route(routes); //untuk menyambungkan dengan routes.js

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init();