import * as types from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';

export function addTodo(text) {
    return {
        type: types.ADD_TODO,
        text
    };
}

export function removeTodo(id) {
    return {
        type: types.REMOVE_TODO,
        id
    };
}

export function editTodo(id, text) {
    return {
        type: types.EDIT_TODO,
        id,
        text
    };
}

    export function doneTodo(id) {
    return {
        type: types.DONE_TODO,
        id
    };
}

export function changeTodoOrder(id, newOrder) {
    return {
        type: types.CHANGE_TODO_ORDER,
        id,
        newOrder
    };
}

function requestTodos() {
    return {
        type: types.REQUEST_TODOS
    };
}

function recieveTodos(todos) {
    return {
        type: types.RECIEVE_TODOS,
        todos
    };
}

export function fetchTodos() {
    return dispatch => {
        const startTime = new Date().getTime();
        dispatch(requestTodos());
        return fetch('todos')
            .then(res => {
                // console.log(res.json());
                return res.json();
            })
            .then(todos => {
                console.log(todos);
                const elapsedTime = new Date().getTime() - startTime;
                if (elapsedTime < 1000) {
                    setTimeout(() => {
                        dispatch(recieveTodos(todos));
                    }, Math.abs(1000 - elapsedTime));
                } else {
                    dispatch(recieveTodos(todos));
                }
            });
    };
}
