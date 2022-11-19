/* eslint-disable require-jsdoc */

import {makeAutoObservable, observable} from 'mobx';
// eslint-disable-next-line require-jsdoc
class TreetableStore {
  columns = observable([
  ]);
  /**
     * Creating observable state
     */
  constructor() {
    makeAutoObservable(this);
  }
  updateSelect(dataIndex) {
    const updated = this.columns.find((column) => column.dataIndex ===
    dataIndex);
    updated.select = !updated.select;
  }
}
const treetableStore = new TreetableStore();
export default treetableStore;
