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
class FlameGraphStore {
  dataShowType=0;
  metricIndex=0;
  /**
   * Creating observable state
   */
  constructor() {
    makeAutoObservable(this);
  }
  setDataShowType = (value) => {
    this.dataShowType = value;
  };
  setMetricIndex = (value) => {
    this.metricIndex = value;
  };
}
const flamegraphStore = new FlameGraphStore();
export default flamegraphStore;
