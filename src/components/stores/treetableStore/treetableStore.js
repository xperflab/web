import {makeAutoObservable, observable} from 'mobx';
/**
 * To control the select metric of treetable.
 */
class TreetableStore {
  columns = observable([
  ]);
  /**
     * Creating observable state
     */
  constructor() {
    makeAutoObservable(this);
  }
  /**
   * Update the columns of the treetable.
   * @param {dataIndex} dataIndex: the index of the treetabl column
   */
  updateSelect(dataIndex) {
    const updated = this.columns.find((column) => column.dataIndex ===
    dataIndex);
    updated.select = !updated.select;
  }
}
const treetableStore = new TreetableStore();
export default treetableStore;
