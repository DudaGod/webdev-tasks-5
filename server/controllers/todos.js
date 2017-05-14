'use strict';

const Todo = require('../models/todo');

exports.list = (req, res) => {
    res.json(Todo.getAll());
};

exports.add = (req, res) => {
    const data = {
        text: req.body.text
    };
    const todo = new Todo(data);
    todo.save();
    res.send(data);
};

exports.edit = (req, res) => {
    console.log('edit');
};

exports.updateOrder = (req, res) => {
    Todo.updateOrder(req.body.todos);
};
