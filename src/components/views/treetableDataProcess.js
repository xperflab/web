/* eslint-disable require-jsdoc */
/* eslint-disable react/no-deprecated */
/* eslint-disable max-len */

import 'antd/dist/antd.min.css';
import {Select} from 'antd';
import {Component} from 'react';
import Treetable from './treetable';
import '../views-css/treetable.css';
import React from 'react';
import Example from './select';
const {Option} = Select;
export default class TreetableDataProcess extends Component {
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
      tableHeight: 550,
    };
    this.viewContainer = React.createRef();
    this.buttons = React.createRef();
    this.select = React.createRef();
  }

  componentWillMount() {
    const temp = [];
    const defaultSelect =[];
    const jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    const MetricTypesArray = JSON.parse(jsonStr2);
    console.log(MetricTypesArray);
    const cols = [];
    cols.push({
      dataIndex: 'name',
      title: 'name',
      width: 600,
      ellipsis: true,

    });
    MetricTypesArray.forEach((element) => {
      cols.push({
        dataIndex: 'i' + element.id,
        title: element.name + ' [INC]',
        width: 100,
        onHeaderCell: (column) => {
          return {
            onClick: () => {
              console.log(column);
              console.log(element);
              const metricIdx = parseInt(element.id);
              const valueType = 0;
              window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
              const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
              const dataList = JSON.parse(jsonStr);
              console.log(dataList);
              this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
            },
          };
        },

      });
      cols.push({
        dataIndex: 'e' + element.id,
        title: element.name + ' [EXC]',
        width: 100,
        onHeaderCell: (column) => {
          return {
            onClick: () => {
              console.log(column);
              console.log(element);
              const metricIdx = parseInt(element.id);
              console.log(metricIdx);
              const valueType = 1;
              window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
              const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
              const dataList = JSON.parse(jsonStr);
              console.log(dataList);
              this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
            },
          };
        },

      });
    });
    this.setState({metricArray: MetricTypesArray});
    this.setState({columns: cols});
    for (let i = 1; i < cols.length; i++) {
      temp.push(<Option key={cols[i].dataIndex}>{cols[i].title}</Option>);
      defaultSelect.push(cols[i].dataIndex);
    }
    this.setState({children: temp});
    this.setState({defaultSelects: defaultSelect});
    console.log(temp);

    window.Module._updateValueTree(1, this.state.dataShowType, 0);
    const jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
    const tableData = JSON.parse(jsonStr);

    this.setState({tableList: tableData, tablekey: this.state.tablekey + 1});
  }
  componentDidMount() {
    console.log(this.viewContainer.current.clientHeight);
    console.log(this.buttons.current.clientHeight);
    console.log(this.select.current.clientHeight);
    const tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight-this.select.current.clientHeight;
    this.setState({tableHeight: tableHeight});
    this.resizeObserver = new ResizeObserver((entries) => {
      console.log('resize');
      const tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight-this.select.current.clientHeight;
      this.setState({tableHeight: tableHeight});
    });
    this.resizeObserver.observe(document.getElementById('select'));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataShowType != this.state.dataShowType) {
      window.Module._updateValueTree(1, this.state.dataShowType, 0);
      const jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
      const tableData = JSON.parse(jsonStr);

      this.setState({tableList: tableData, tablekey: this.state.tablekey + 1});
    }
  }
  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  changeToTopDown = () => {
    // this.state.dataShowType = 1;
    // this.drawFlameGraph(0,  this.state.metricIndex, "")
    this.setState({dataShowType: 0});
  };


  changeToBottomUp = () => {
    this.setState({dataShowType: 1});
  };

  changeToFlat = () => {
    this.setState({dataShowType: 2});
  };
  handleChange = (value) => {
    console.log(value);
    console.log(this.state.metricArray);
    const cols = [];
    cols.push({
      dataIndex: 'name',
      title: 'name',
      width: 600,
      ellipsis: true,
    });
    this.state.metricArray.forEach((element) => {
      const index = 'i' + element.id;
      if (value.includes(index)) {
        cols.push({
          dataIndex: 'i' + element.id,
          title: element.name + ' [INC]',
          width: 100,
          onHeaderCell: (column) => {
            return {
              onClick: () => {
                console.log(column);
                console.log(element);
                const metricIdx = parseInt(element.id);
                const valueType = 0;
                window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
                const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
                const dataList = JSON.parse(jsonStr);
                this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
              },
            };
          },

        });
      }
      const index2 = 'e' + element.id;
      if (value.includes(index2)) {
        cols.push({
          dataIndex: 'e' + element.id,
          title: element.name + ' [EXC]',
          width: 100,
          onHeaderCell: (column) => {
            return {
              onClick: () => {
                console.log(column);
                console.log(element);
                const metricIdx = parseInt(element.id);
                console.log(metricIdx);
                const valueType = 1;
                window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
                const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
                const dataList = JSON.parse(jsonStr);
                console.log(dataList);
                this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
              },
            };
          },

        });
      }
    });
    console.log(cols);
    this.setState({columns: cols});
  };

  render() {
    return (
      <div ref={this.viewContainer} className='h-full w-full'>
        <div ref={this.buttons} >
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
        </div>
        <link
          href="https://cdn.jsdelivr.net/npm/@tailwindcss/custom-forms@0.2.1/dist/custom-forms.css"
          rel="stylesheet"
        />

        <div id= "select"ref={this.select}>
          <Select

            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            defaultValue={this.state.defaultSelects}
            onChange={this.handleChange}
          >
            {this.state.children}
          </Select>
          <Example/>
        </div>
        <div><Treetable tableHeight ={this.state.tableHeight} key={this.state.tablekey} dataShowType={this.state.dataShowType} cols={this.state.columns} tableList={this.state.tableList} /></div>
      </div>
    );
  }
}


