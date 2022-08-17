import {makeAutoObservable} from 'mobx';

/**
 * Control the light theme and dark theme.
 * Control the current component
 */
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
  setVRTrace= () => {
    this.currentComponent = 'vrtrace';
  };
}
const viewStore= new ViewStore();
export default viewStore;
