/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';


class ViewStore {
  currentComponent = 'homeview'; // default value
  theme = 'dark';
  /**
   * Creating observable state
   */
  constructor() {
    makeAutoObservable(this);
  }
  setThemeDark = () => {
    this.theme = 'dark';
  };
  setThemeLight = () => {
    this.theme = 'light';
  };
  setCurrentFlameGraph = () => {
    this.currentComponent = 'flamegraph';
  };
  setCurrentTreeTable= () => {
    this.currentComponent = 'treetable';
  };
  setCurrentHomeView= () => {
    this.currentComponent = 'homeview';
  };
  setCurrentVRTrace= () => {
    this.currentComponent = 'vrtrace';
  };
}
const viewStore= new ViewStore();
export default viewStore;
