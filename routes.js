const routes = [
    {
        method: 'GET', //untuk menandai method get
        path: '/', //untuk menandai route
        handler: (request, h) => {
            return 'Homepage';
        },
    },
    {
        method: 'GET', //untuk menandai method get
        path: '/about',
        handler: (request, h) => {
            return 'About page';
        },
    },
];

module.exports = routes;