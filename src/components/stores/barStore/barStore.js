/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';

/**
 *  sidebarOpen : When screen width is less than 768px, control open
 *  sidebar or close sidebar.
 *
 *  showSidebar : Click buttons to show the sidebar or hide the sidebar.
 * if sidebar is hided, the dropzone will be shown.
 * else, the dropzone will be hidden.
 */
class BarStore {
  sidebarOpen = false;
  showSidebar = true;
  showCurrentProfile = false;
  showVRTrace = false;
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
  setShowCurrentProfile = (value) => {
    this.showCurrentProfile = value;
  };
  setShowVRTrace = (value) => {
    this.showVRTrace = value;
  };
}
const barStore = new BarStore();
export default barStore;
