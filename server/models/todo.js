'use strict';

const DATE_LENGTH = 8;
let memoryStorage = [];

class Todo {
    constructor(data) {
        this.id = data.id ? data.id : this.generateUniqueId();
        this.text = data.text;
        this.isDone = data.isDone ? data.isDone : false;
    }
    save() {
        memoryStorage.push(this);
    }
    remove() {
        memoryStorage.splice(memoryStorage.indexOf(this), 1);
    }
    edit(newText) {
        this.text = newText;
    }
    static getAll() {
        console.log('GET ALL TODOS');
        console.dir(memoryStorage);
        return memoryStorage;
    }
    static incrementHexId(prevId) {
        if (!prevId) {
            return parseInt(Math.random() * 100).toString(16);
        }
        const incPartNum = parseInt(prevId.slice(DATE_LENGTH), 16);
        return (incPartNum + 1).toString(16);
    }
    generateUniqueId() {
        const dateHex = new Date().valueOf().toString(16).slice(-DATE_LENGTH);
        const prevId = memoryStorage.length ? memoryStorage[memoryStorage.length - 1].id : null;
        const incHex = this.constructor.incrementHexId(prevId);
        return dateHex + incHex;
    }
    static updateOrder(newStorage) {
        console.dir(memoryStorage);
        memoryStorage = newStorage.map(item => new Todo(item));
        // memoryStorage = newStorage;
        console.dir(memoryStorage);
        // return memoryStorage;
    }
}

memoryStorage.push(new Todo({
    text: 'Купить котика'
}));

memoryStorage.push(new Todo({
    text: 'Сходить на ДАМП'
}));

memoryStorage.push(new Todo({
    text: 'Навестить бабуленьку'
}));

memoryStorage.push(new Todo({
    text: 'Сделать 5-ю задачу'
}));

module.exports = Todo;
