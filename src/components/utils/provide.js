/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {storeContext} from './store';
export default class Provider extends Component {
  render() {
    return (
      <storeContext.Provider value={this.props.store}>
        {this.props.children}
      </storeContext.Provider>
    );
  }
}
