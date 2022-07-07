/**
 * eslint require
 */
import {React} from 'react';

import {Component} from 'react';
import LeftBar from './components/bars/leftBar';
import ViewContainer from './components/views/viewContainer';
import OpenFileDropezone from './components/utils/openFileDropzone';

/**
 *
 * @param { Component} value
 */
export default class App extends Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      sideState: {
        showSidebar: true,
        sidebarOpen: false,
        setShowSidebar: this.setShowSidebar.bind(this),
        setSidebarOpen: this.setSidebarOpen.bind(this)},
    };
  }
  /**
   * Click buttons to show the sidebar or hide the sidebar.
   * @param {boolean} value
   */

  setShowSidebar = (value) =>{
    const newSideState = Object.assign(this.state.sideState,
        {showSidebar: value});
    this.setState({
      sideState: newSideState},
    );
  };
  /**
   * When screen width is less than 768px, control open
   * sidebar or close sidebar.
   * @param {boolean} value
   */
  setSidebarOpen = (value) => {
    const newSideState = Object.assign(this.state.sideState,
        {showSidebar: value});
    this.setState({
      sideState: newSideState},
    );
  };
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="h-full">
        <LeftBar sideState = {this.state.sideState}/>
        <ViewContainer sideState = {this.state.sideState}/>
        <OpenFileDropezone/>
      </div>
    );
  }
}

