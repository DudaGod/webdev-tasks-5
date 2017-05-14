import * as TodoActions from '../actions/TodoActions';
import * as types from '../constants/ActionTypes';
import sendQuery from '../utils/sendDataToServer';

const initialState = {
    todos: [],
    isFetching: false
};

const todoPropsDefault = {
    isDone: false
};

const DATE_LENGTH = 8;

function incrementHexId(prevId) {
    if (!prevId) {
        return parseInt(Math.random() * 100).toString(16);
    }
    const incPartNum = parseInt(prevId.slice(DATE_LENGTH), 16);
    return (incPartNum + 1).toString(16);
}

function generateUniqueId(todos) {
    const dateHex = new Date().valueOf().toString(16).slice(-DATE_LENGTH);
    const prevId = todos.length ? todos[todos.length - 1].id : null;
    const incHex = incrementHexId(prevId);
    return dateHex + incHex;
}

export default function todos(state = initialState, action) {
    switch (action.type) {
        case types.ADD_TODO:
            return Object.assign({}, state, {
                todos: [...state.todos,
                    Object.assign({
                    id: generateUniqueId(state.todos),
                    text: action.text
                }, todoPropsDefault)]
            });

        case types.EDIT_TODO:
            return Object.assign({}, state,
                {todos: state.todos.map(todo =>
                    todo.id === action.id ?
                    {...todo, text: action.text} : todo
                )});

        case types.REMOVE_TODO:
            return Object.assign({}, state,
                {todos: state.todos.filter(item => item.id !== action.id)});

        case types.DONE_TODO:
            return Object.assign({}, state,
                {todos: state.todos.map(todo =>
                    todo.id === action.id ?
                    {...todo, isDone: !todo.isDone} : todo)});

        case types.CHANGE_TODO_ORDER:
            const todo = state.todos.filter(item => item.id === action.id)[0];
            const index = state.todos.indexOf(todo);
            const newTodos = [].concat(state.todos.slice(0, index), state.todos.slice(index + 1));
            newTodos.splice(action.newOrder, 0, todo);

            sendQuery('change-todos', 'PUT', {todos: newTodos});

            return Object.assign({}, state,
                {todos: newTodos});

        case types.REQUEST_TODOS:
            return Object.assign({}, state, {isFetching: true});

        case types.RECIEVE_TODOS:
            return Object.assign({}, state,
                {todos: action.todos, isFetching: false});

        /*case types.FETCH_TODO_LIST:
            fetch('api/todos')
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log(data);
                    // data.forEach(item => todos(state, {type: 'ADD_TODO', text: item.text}));
                    // data.forEach(item => TodoActions.addTodo(item.text));
                });

        case types.REMOVE_TODO:
            return state.filter(todo => todo.id !== action.id);

        case types.EDIT_TODO:
            return state.map(todo => {
                todo.id === action.id ?
                    { ...todo, text: action.text } :
                    todo;
            });*/

        default:
            return state;
    }
}
