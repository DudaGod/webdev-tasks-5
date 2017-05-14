'use strict';

let startPointX,
    startPointY,
    currPointX,
    currPointY,
    distX,
    distY,
    target,
    element,
    startTime;

const requiredDist = 50; // required dist to be considered as swipe
const minDist = 25; // minimal dist to change element position
const restraint = 50; // maximum dist allowed at the same time in perpendicular direction
const tapDist = 25; // maximum dist to be considered as tap or long tap
const allowedTime = 500; // minimum time to be considered as long tap

const calcDists = e => {
    currPointX = e.changedTouches[0].pageX;
    currPointY = e.changedTouches[0].pageY;

    distX = parseInt(currPointX - startPointX);
    distY = parseInt(currPointY - startPointY);
};

const horizontalSwipe = threshold => {
    return Math.abs(distX) >= threshold && Math.abs(distY) <= restraint;
};

const verticalSwipe = threshold => {
    return Math.abs(distY) >= threshold && Math.abs(distX) <= restraint;
};

const setTransform = (prop, value) => {
    element.style.transform = `${prop}(${value}px)`;
};

const isTap = () => {
    return Math.abs(distX) < tapDist;
};



export const onTouchStart = e => {
    console.log(e);
    startPointX = e.changedTouches[0].pageX;
    startPointY = e.changedTouches[0].pageY;

    startTime = new Date().getTime();
    target = e.target;
};

export const onTouchMove = e => {
    calcDists(e);

    if ((element = target.closest('.todo')) && horizontalSwipe(minDist)) {
        setTransform('translateX', distX);
    } else if ((element = target.closest('.root')) && verticalSwipe(minDist)) {
        const val = distY > minDist ? distY : 0;
        setTransform('translateY', val > 60 ? 60 : val);
    }
};

export const onTouchEnd = (e, cb) => {
    // e.preventDefault();
    calcDists(e);

    if (element = target.closest('.todo')) {
        if (horizontalSwipe(requiredDist)) {
            distX > 0 ? setTransform('translateX', 20) && cb('right') :
                setTransform('translateX', -20) && cb('left');
        } else {
            setTransform('translateX', 0);
            if (isTap()) {
                const elapsedTime = new Date().getTime() - startTime;
                elapsedTime >= allowedTime ? cb('longTap') : cb('tap');
            }
        }
    } else if (element = target.closest('.root')) {
        if (verticalSwipe(requiredDist)) {
            distY > minDist ? setTransform('translateY', 0) || cb('down') :
                setTransform('translateY', 0) || cb('up');
        } else {
            setTransform('translateY', 0);
        }
    }
};
