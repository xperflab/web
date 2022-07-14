/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import {makeAutoObservable} from 'mobx';
class BarStore {
  sidebarOpen = false;
  showSidebar = true;
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
