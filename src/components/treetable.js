
import 'antd/dist/antd.min.css';
import { Select } from "antd";
import { Component } from 'react';

export default class treetable extends Component {
  constructor(props) {
    super(props);
    //  this.sortChangeEvent = this.sortChangeEvent.bind(this);
    this.state = {
      expandedKeys: [],
      tableList: [],
      columns: [],
      dataShowType: 0,
      metricIndex: 0,
      children: [],
      metricArray: [],
      defaultSelects: [],
      tablekey: 0,
    };
  }

  render() {
    return (
      <div>
        <button
          type="button"
          onClick={this.changeToTopDown}
          className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          Top Down
        </button>
        <button
          type="button"
          onClick={this.changeToBottomUp}
          className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          Bottom Up
        </button>
        <button
          type="button"
          onClick={this.changeToFlat}
          className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          Flat
        </button>
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "100%"
          }}
          placeholder="Please select"
          defaultValue={this.state.defaultSelects}
          onChange={this.handleChange}
        >
          {this.state.children}
        </Select>
        <div><TreetableTopDown key={this.state.tablekey} dataShowType={this.state.dataShowType} cols={this.state.columns} tableList={this.state.tableList} /></div>

      </div>
    );
  }
}
