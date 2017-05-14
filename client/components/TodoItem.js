import React, { Component, PropTypes } from 'react';
import TodoTextInput from './TodoTextInput';

export default class TodoItem extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        isDone: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isSwipeLeft: false,
            isSwipeRight: false
        };
    }

    handleTap(e) {
        this.setState({
            isEdit: false
        });
    }

    handleEditTodo(id, text) {
        this.props.actions.editTodo(id, text);
    }

    calcDists(e) {
        this.currPointX = e.changedTouches[0].pageX;
        this.currPointY = e.changedTouches[0].pageY;

        this.distX = parseInt(this.currPointX - this.startPointX);
        this.distY = parseInt(this.currPointY - this.startPointY);
        console.log(`distY: ${this.distY}`);
        if (this.isLongTap) {
            this.distY = Math.min(this.maxBottomDist, Math.max(this.maxTopDist, this.distY));
        }
    }

    horizontalSwipe(threshold) {
        return Math.abs(this.distX) >= threshold && Math.abs(this.distY) <= this.restraint;
    }

    verticalSwipe(threshold) {
        return Math.abs(this.distY) >= threshold && Math.abs(this.distX) <= this.restraint;
    }

    setTransform(value) {
        this.elem.style.transform = `translateX(${value}px)`;
    }

    isTap() {
        return Math.abs(this.distX) < this.tapDist && !this.verticalSwipe(this.minDist);
    }

    isLongTapFunc() {
        const elapsedTime = new Date().getTime() - this.startTime;
        return !this.verticalSwipe(this.minDist) && elapsedTime >= this.allowedTime;
    }

    getCoord(elem) {

        const box = elem.getBoundingClientRect();
        return {
            top: parseInt(box.top + pageYOffset),
            bottom: parseInt(box.bottom + pageYOffset)
        };
    }

    onTouchStart(e) {
        this.startPointX = e.changedTouches[0].pageX;
        this.startPointY = e.changedTouches[0].pageY;

        this.elem = e.target.closest('.todos__item');

        this.requiredDist = 50; // required dist to be considered as swipe
        this.minDist = 25; // minimal dist to change element position
        this.offsetX = 20;
        this.restraint = 50; // maximum dist allowed at the same time in perpendicular direction
        this.tapDist = 10; // maximum dist to be considered as tap or long tap
        this.allowedTime = 500; // minimum time to be considered as long tap

        this.startTime = new Date().getTime();

        this.directionCalcFrom = 0;
        this.isLongTap = false;
        // console.log('touch start');

        this.timer = setTimeout(() => {
            this.isLongTap = true;
            this.elem.style.transform = 'scale(1.1) translateZ(100px)';
            this.elem.style.zIndex = '1';

            this.parentElem = this.getCoord(this.elem.parentElement);
            this.elems = [].slice.call(this.elem.parentElement.children);
            this.currElem = this.getCoord(this.elem);

            this.maxTopDist = parseInt(this.parentElem.top + (this.startPointY - this.currElem.top) - this.startPointY);
            this.maxBottomDist = parseInt(this.parentElem.bottom - this.startPointY - (this.currElem.bottom - this.startPointY));

            console.log(`startPointY: ${this.startPointY}`);
            console.log(`parent.top: ${this.parentElem.top}, parent.bottom: ${this.parentElem.bottom}, currElem.top: ${this.currElem.top}, currElem.bottom: ${this.currElem.bottom}, maxTop: ${this.maxTopDist}, maxBottom: ${this.maxBottomDist}`);

            this.distBetweenElems = 0;

            let sibling;
            if (sibling = this.elem.nextElementSibling || this.elem.previousElementSibling) {
                this.distBetweenElems = parseInt(Math.abs(this.currElem.top - this.getCoord(sibling).top));
            }
        }, this.allowedTime);
    }

    move(nextOrder, isDown) {
        const nextElem = this.elems.filter(item => item.style.order === nextOrder.toString())[0];
        if (!nextElem) {
            return;
        }

        const siblingElemCoord = this.getCoord(nextElem);
        const siblingElemMiddle = parseInt(siblingElemCoord.top +
            (siblingElemCoord.bottom - siblingElemCoord.top) / 2);

        const currElemCoord = this.getCoord(this.elem);
        const borderPos = parseInt(isDown ? currElemCoord.bottom : currElemCoord.top);

        // console.log(`border - ${borderPos} and middle - ${siblingElemMiddle}`);

        if (isDown && borderPos > siblingElemMiddle) {
            this.changeOrder(nextElem, isDown);
        } else if (!isDown && borderPos < siblingElemMiddle) {
            this.changeOrder(nextElem, isDown);
        }
    }


    getOneOfTransformStyles(property, elem) {
        var regExp = new RegExp(`${property}\\((-?\\d+)px\\)`);
        return elem.style.transform.match(regExp)[1];
    }

    changeOrder(siblingElem, isDown) {
        this.currElem = this.getCoord(this.elem);

        const temp = siblingElem.style.order;
        siblingElem.style.order = this.elem.style.order;
        this.elem.style.order = temp;

        this.startPointY += isDown ? this.distBetweenElems : -this.distBetweenElems;

        const translateY = this.getOneOfTransformStyles('translateY', this.elem) || 0;
        console.log(`TRANSLATEY - ${translateY}`);
        // this.maxTopDist = parseInt(this.parentElem.top - this.currElem.top + translateY);
        // this.maxBottomDist = parseInt(this.parentElem.bottom - this.currElem.bottom);
        // this.maxTopDist = parseInt(this.parentElem.top + (this.startPointY - this.currElem.top) - this.startPointY);
        // this.maxBottomDist = parseInt(this.parentElem.bottom - this.startPointY - (this.currElem.bottom - this.startPointY));


        this.newOrder = this.elem.style.order;


        // this.currPointY = this.elem.
        this.distY = parseInt(this.currPointY - this.startPointY);

        this.maxTopDist = parseInt(this.parentElem.top - this.currElem.top + this.distY);
        this.maxBottomDist = parseInt(this.parentElem.bottom - this.currElem.bottom + this.distY);

        console.log(`startPointY: ${this.startPointY}`);
        console.log(`parent.top: ${this.parentElem.top}, parent.bottom: ${this.parentElem.bottom}, currElem.top: ${this.currElem.top}, currElem.bottom: ${this.currElem.bottom}, maxTop: ${this.maxTopDist}, maxBottom: ${this.maxBottomDist}`);

        this.distY = Math.min(this.maxBottomDist, Math.max(this.maxTopDist, this.distY));

        this.directionCalcFrom = this.distY;
        // this.startPointY = this.distY;
        console.log(`end distY - ${this.distY}`);
    }

    onTouchMove(e) {
        this.calcDists(e);

        if (this.isLongTap) {
            e.stopPropagation();

            const currEl = this.getCoord(this.elem);
            console.log(`currEl.top: ${currEl.top}, currEl.bottom: ${currEl.bottom}`);

            console.log(`start distY - ${this.distY}`);
            // console.log(`calc from - ${this.directionCalcFrom}`);
            // console.log(`between elems - ${this.distBetweenElems}`);

            if (this.distY > this.directionCalcFrom) {
                this.move(Number(this.elem.style.order) + 1, true);
            } else {
                this.move(Number(this.elem.style.order) - 1, false);
            }

            this.elem.style.transform = `translateX(0px) translateY(${this.distY}px) scale(1.1) translateZ(100px)`;
            // this.calcDists(e);





            // const currElem = this.getCoord(this.elem);
            /*const nextElem = this.elem.nextElementSibling;
            const nextElemCoord = this.getCoord(nextElem);
            const nextElemMid = parseInt(nextElemCoord.top + (nextElemCoord.bottom - nextElemCoord.top) / 2);
            const currElemCoord = this.getCoord(this.elem);

            const distBetweenElems =
            // console.log(`${nextElemMid} - ${currElemCoord.bottom} + ${currElemCoord.top}`);

            console.log(`${currElemCoord.top} - ${currElemCoord.bottom} and ${nextElemCoord.top} - ${nextElemCoord.bottom} and mid - ${nextElemMid}`);
            if (currElemCoord.bottom > nextElemMid) {
                const temp = nextElem.style.order;
                nextElem.style.order = this.elem.style.order;
                this.elem.style.order = temp;
                this.elem.startPointY += this.distBetweenElems;
                console.log('good');
                const dist = parseInt(nextElemCoord.top - this.currElem.top);
                // console.log(dist);
                nextElem.style.transform = `translateY(-${dist}px)`;
            }
            this.elem.style.transform = `translateX(0px) translateY(${this.distY}px) scale(1.1) translateZ(100px)`;*/
        } else {
            clearTimeout(this.timer);
            // this.calcDists(e);

            if (this.horizontalSwipe(this.minDist)) {
                this.setTransform(this.distX);
            }
        }
    }

    onTouchEnd(e) {
        this.calcDists(e);

        if (!this.isLongTapFunc()) {
            clearTimeout(this.timer);
        }

        if (this.isLongTap) {
            e.stopPropagation();
            this.elem.style.zIndex = '0';
            this.props.actions.changeTodoOrder(this.props.id, this.newOrder);
        }


        if (this.horizontalSwipe(this.requiredDist)) {
            if (this.distX > 0) {
                this.setTransform(this.offsetX);
                this.setState({
                    isSwipeLeft: false,
                    isSwipeRight: true
                });
            } else {
                this.setTransform(-this.offsetX);
                this.setState({
                    isSwipeLeft: true,
                    isSwipeRight: false
                });
            }
        } else {
            this.setTransform(0);
            this.setState({
                isSwipeLeft: false,
                isSwipeRight: false
            });

            /*if (this.isLongTap()) {
                this.isLongTap = true;
            } else if (this.isTap()) {

            }*/

            if (this.isTap()) {
                // this.onTap(e);

                const elapsedTime = new Date().getTime() - this.startTime;
                elapsedTime >= this.allowedTime ? this.onLongTap(e) : this.onTap(e);
            }
        }
    }

    onLongTap(e) {

    }

    onTap(e) {
        e.preventDefault();
        this.setState({
            isEdit: true
        });
    }

    onRemove() {
        this.props.actions.removeTodo(this.props.id);
    }

    onDone(e) {
        e.stopPropagation();
        this.setTransform(0);
        this.setState({
            isSwipeRight: false
        });
        this.props.actions.doneTodo(this.props.id);
    }

    render() {
        console.log(`RENDER ITEMS with order - ${this.props.index}`);
        return (
            <li className='todos__item' style={{order: this.props.index}}
                onTouchStart={this.state.isEdit ? null : ::this.onTouchStart}
                onTouchMove={this.state.isEdit ? null : ::this.onTouchMove}
                onTouchEnd={this.state.isEdit ? null : ::this.onTouchEnd}>
                {this.state.isSwipeRight ?
                    <div className="todo__btn_done"
                        onTouchStart={::this.onDone} /> :
                    null}
                {this.state.isEdit ? <TodoTextInput
                    id={this.props.id}
                    text={this.props.text}
                    newTodo={false}
                    placeholder='What needs to be done?'
                    onSaveTodo={::this.handleEditTodo}
                    onShowTodo={::this.handleTap}
                    /> :
                <div className='todo'>
                    <p className='todo__text' style={this.props.isDone ? ({ textDecoration: 'line-through' }) : null}>{this.props.text}</p>
                </div>
                }
                {this.state.isSwipeLeft ?
                    <div className="todo__btn_delete"
                        onTouchStart={::this.onRemove} /> :
                    null}
            </li>
        )
    }
}
