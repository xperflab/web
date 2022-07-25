/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';


class ViewStore {
  currentComponent = 'homeview'; // default value
  /**
   * Creating observable state
   */
  constructor() {
    makeAutoObservable(this);
  }
  setCurrentFlameGraph = () => {
    this.currentComponent = 'flamegraph';
  };
  setCurrentTreeTable= () => {
    this.currentComponent = 'treetable';
  };
  setCurrentHomeView= () => {
    this.currentComponent = 'homeview';
  };
  setVRTrace= () => {
    this.currentComponent = 'vrtrace';
  };
}
const viewStore= new ViewStore();
export default viewStore;
