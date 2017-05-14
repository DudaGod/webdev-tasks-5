import React, { Component, PropTypes } from 'react';

export default class TodoTextInput extends Component {
    static propTypes = {
        onSaveTodo: PropTypes.func.isRequired,
        onShowTodo: PropTypes.func.isRequired,
        newTodo: PropTypes.bool.isRequired,
        placeholder: PropTypes.string,
        text: PropTypes.string,
        id: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text || ''
        };
    }

    handleSaveTodo() {
        if (!this.state.text.trim().length) {
            console.log('ERROR: text length');
            // show error
            return;
        }

        this.props.newTodo ? this.props.onSaveTodo(this.state.text) :
            this.props.onSaveTodo(this.props.id, this.state.text);

        if (this.props.newTodo) {
            this.setState({ text: '' });
        }
        this.props.onShowTodo();
    }

    handleSubmit(e) {
        if (e.which === 13) {
            this.handleSaveTodo();
        }
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        });
    }

    render() {
        return (
            <div className='addTodo'>
                <input
                    type='text' className='addTodo__input'
                    autoFocus='true' value={this.state.text}
                    placeholder={this.props.placeholder}
                    onChange={::this.handleChange}
                    onKeyDown={::this.handleSubmit}
                />
                <div className='addTodo__btns'>
                    <button onClick={this.props.onShowTodo} className='addTodo__btn addTodo__btn--cancel'>Я передумал</button>
                    <button onClick={::this.handleSaveTodo} className='addTodo__btn  addTodo__btn--save'>Сохранить</button>
                </div>
            </div>
        );
    }
}
