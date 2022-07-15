/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';

/**
 *  sidebarOpen : When screen width is less than 768px, control open
 *  sidebar or close sidebar.
 *
 *  showSidebar : Click buttons to show the sidebar or hide the sidebar.
 */
class BarStore {
  sidebarOpen = false;
  showSidebar = true;
  /**
   * Creating observable state
   */
  constructor() {
    makeAutoObservable(this);
  }
  setSidebarOpen = (value) => {
    this.sidebarOpen = value;
  };
  setShowSidebar = (value) => {
    this.showSidebar = value;
  };
}
const barStore = new BarStore();
export default barStore;
