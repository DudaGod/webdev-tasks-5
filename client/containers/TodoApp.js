import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as TodoActions from '../actions/TodoActions';
import Main from '../components/Main';

class TodoApp extends Component {
    componentDidMount() {
        this.props.actions.fetchTodos();
    }

    render() {
        const {todos, isFetching, actions} = this.props;
        return (
            <Main todos={todos} isFetching={isFetching} actions={actions} />
        );
    }
}

function mapState(state) {
    const {todos, isFetching} = state.todos;
    return {
        todos,
        isFetching
    };
}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators(TodoActions, dispatch)
    };
}

export default connect(mapState, mapDispatch)(TodoApp);
