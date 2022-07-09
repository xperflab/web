import React from 'react';
export const storeContext = React.createContext();
export const initialState = {
  showSidebar: true,
  sidebarOpen: false,
};
export const reducer = (state, action)=>{
  switch (action.type) {
    case 'setShowSidebarTrue':
      return {showSidebar: true, sidebarOpen: state.sidebarOpen};
    case 'setShowSidebarFalse':
      return {showSidebar: false, sidebarOpen: state.sidebarOpen};
    case 'setSidebarOpenTrue':
      return {showSidebar: state.showSidebar, sidebarOpen: true};
    case 'setSidebarOpenFalse':
      return {showSidebar: state.showSidebar, sidebarOpen: false};
    default:
      return initialState;
  }
};
