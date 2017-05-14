import React, { Component, PropTypes } from 'react';
import TodoTextInput from './TodoTextInput';

export default class Footer extends Component {
    static propTypes = {
        addTodo: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            showTodoInput: false
        };
    }

    handleSaveTodo(text) {
        this.props.addTodo(text);
    }

    handleShowTodo() {
        this.setState({
            showTodoInput: !this.state.showTodoInput
        });
    }

    render() {
        return (
            <footer className='footer'>
                {this.state.showTodoInput ? <TodoTextInput
                    onSaveTodo={::this.handleSaveTodo}
                    onShowTodo={::this.handleShowTodo}
                    placeholder='What needs to be done?'
                    newTodo={true} /> :
                    <button onClick={::this.handleShowTodo} className='show-add-todo'></button>}
            </footer>
        )
    }
}
