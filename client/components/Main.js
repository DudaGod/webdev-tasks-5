import React, { Component, PropTypes } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TodoItem from './TodoItem';
import { SHOW_ALL, SHOW_DONE, SHOW_CURRENT } from '../constants/ActionTypes';
// import { onTouchStart, onTouchMove, onTouchEnd } from '../utils/touchEvents';

const TODO_FILTERS = {
    SHOW_ALL: () => true,
    SHOW_DONE: (todo) => todo.isDone,
    SHOW_CURRENT: (todo) => !todo.isDone
};

export default class Main extends Component {
    static propTypes = {
        todos: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = { filter: SHOW_ALL };
    }

    handleShow(filter) {
        this.setState({
            filter: filter
        });
    }

    calcDists(e) {
        this.currPointX = e.changedTouches[0].pageX;
        this.currPointY = e.changedTouches[0].pageY;

        this.distX = parseInt(this.currPointX - this.startPointX);
        this.distY = parseInt(this.currPointY - this.startPointY);
    }

    verticalSwipe(threshold) {
        return Math.abs(this.distY) >= threshold && Math.abs(this.distX) <= this.restraint;
    }

    onTouchStart(e) {
        this.startPointX = e.changedTouches[0].pageX;
        this.startPointY = e.changedTouches[0].pageY;


        this.requiredDist = 50; // required dist to be considered as swipe
        this.minDist = 25; // minimal dist to change element position
        this.maxDist = 60;
        this.restraint = 50; // maximum dist allowed at the same time in perpendicular direction
    }

    onTouchMove(e) {
        this.calcDists(e);
        this.rootElem = document.querySelector('.root');

        if (this.verticalSwipe(this.minDist)) {
            const val = this.distY > this.minDist ? this.distY : 0;
            this.rootElem.style.transform = `translateY(${val > this.maxDist ? this.maxDist : val}px)`;
        }
    }

    onTouchEnd(e) {
        this.calcDists(e);

        if (this.rootElem) {
            this.rootElem.style.transform = 'translateY(0px)';
        }

        if (this.verticalSwipe(this.requiredDist) && this.distY > 0) {
            this.props.actions.fetchTodos();
        }
    }

    render() {
        const { todos, isFetching, actions } = this.props;
        const { filter } = this.state;

        const filteredTodos = todos.filter(TODO_FILTERS[filter]);
        return (
            <div className='root'>
                <Header filter={filter} isFetching={isFetching} onShow={::this.handleShow} />
                <div className='main'
                    onTouchStart={::this.onTouchStart}
                    onTouchMove={::this.onTouchMove}
                    onTouchEnd={::this.onTouchEnd}
                >
                    <ul className='todos'>
                        {filteredTodos.map((todo, index) => <TodoItem
                            key={todo.id}
                            id={todo.id}
                            isDone={todo.isDone}
                            text={todo.text}
                            actions={actions}
                            index={index}
                        />)}
                    </ul>
                </div>
                <Footer addTodo={actions.addTodo} />
            </div>
        );
    }
}
