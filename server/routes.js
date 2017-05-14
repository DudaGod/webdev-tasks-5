'use strict';

const pages = require('./controllers/pages');
const todos = require('./controllers/todos');

module.exports = (app) => {
    app.get('/', pages.index);
    app.get('/todos', todos.list);
    app.put('/change-todos', todos.updateOrder);
    app.get('/test', (req, res) => { res.send('Okay'); });
    app.post('/test', (req, res) => { res.json(req.body); });
    app.all('*', pages.error404);
};

/*
module.exports = (router) => {
    router.route('/')
        .get(pages.index);
    router.route('/api/todos')
        .get(todos.list)
        .put(todos.updateOrder);
    router.route('/test')
        .get(todos.list);
    /!*router.route('/test')
        .put(todos.updateOrder);*!/
    router.route('/api/todo')
        .post(todos.add);
        // .put(todos.edit);
        // .delete(todos.delete);
    router.route('*')
        .all(pages.error404);
};
*/
