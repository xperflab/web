import React, {Component} from 'react';
import Homepage from './pages/homepage';

/**
 *The main component control switches different pages and components.
 */
export default class App extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="h-full"><Homepage/></div>
    );
  }
}

