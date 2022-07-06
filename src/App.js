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
      showSidebar: true,
      sidebarOpen: false,
    };
  }
  /**
   * Click buttons to show the sidebar or hide the sidebar.
   * @param {boolean} value
   */
  setShowSidebar = (value) =>{
    this.setState({
      showSidebar: value,
    });
  };
  /**
   * When screen width is less than 768px, control open
   * sidebar or close sidebar.
   * @param {boolean} value
   */
  setSidebarOpen = (value) => {
    this.setState({
      sidebarOpen: value,
    });
  };
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="h-full">
        <LeftBar showSidebar = {this.state.showSidebar}
          sidebarOpen = {this.state.sidebarOpen}
          setShowSidebar = {this.setShowSidebar}
          setSidebarOpen={this.setSidebarOpen}/>
        <ViewContainer showSidebar ={this.state.showSidebar}
          sidebarOpen = {this.state.sidebarOpen}
          setShowSidebar = {this.setShowSidebar}
          setSidebarOpen={this.setSidebarOpen}/>
        <OpenFileDropezone/>
      </div>
    );
  }
}

