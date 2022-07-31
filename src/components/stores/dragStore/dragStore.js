/* eslint-disable require-jsdoc */
import {makeAutoObservable} from 'mobx';

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
