import React, { Component, PropTypes } from 'react';
import { SHOW_ALL, SHOW_DONE, SHOW_CURRENT } from '../constants/ActionTypes';

const FILTER_TITLES = {
    SHOW_ALL: 'All',
    SHOW_DONE: 'Completed',
    SHOW_CURRENT: 'Current'
};

export default class Header extends Component {
    static propTypes = {
        filter: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        onShow: PropTypes.func.isRequired
    };

    renderFilterLink(filter) {
        const title = FILTER_TITLES[filter];
        const {filter: selectedFilter, onShow} = this.props;

        return (
            <a className={'filter__link ' +
                (selectedFilter === filter ? 'filter__link_selected' : null)}
                onClick={() => onShow(filter)}>{title}</a>
        )
    }

    render() {
        const { isFetching } = this.props;
        return (
            <header className='header'>
                {isFetching ? <div className='loader'>Loading...</div> : null}
                <div className='heading'>
                    <h1 className='heading__text'>TODO-хи</h1>
                </div>
                <ul className='filters'>
                    {Object.keys(FILTER_TITLES).map(filter =>
                        <li className='filters__item' key={filter}>
                            {this.renderFilterLink(filter)}
                        </li>
                    )}
                </ul>
            </header>
        )
    }
}

