/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
/* eslint-disable react/no-deprecated */
/* eslint-disable max-len */

import 'antd/dist/antd.min.css';
import {Component} from 'react';
import Treetable from './treetable';
import React from 'react';
import Select from './select';
import {inject, observer} from 'mobx-react';
import {toJS, autorun} from 'mobx';
import '../views-css/treetableDark.css';
class TreetableDataProcess extends Component {
  constructor(props) {
    console.log(props);
    super(props);
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
      tableHeight: 0,
    };
    this.viewContainer = React.createRef();
    this.buttons = React.createRef();
    this.select = React.createRef();
    this.treetable = React.createRef();
  }

  componentWillMount() {
    const temp = [];
    const defaultSelect =[];
    const jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    const MetricTypesArray = JSON.parse(jsonStr2);
    console.log(MetricTypesArray);
    this.props.TreetableStore.columns.push({
      dataIndex: 'name',
      title: 'name',
      width: 600,
      ellipsis: true,
      select: true,
    });
    MetricTypesArray.forEach((element) => {
      this.props.TreetableStore.columns.push({
        dataIndex: 'i' + element.id,
        title: element.name + ' [INC]',
        width: 200,
        select: true,
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
      this.props.TreetableStore.columns.push({
        dataIndex: 'e' + element.id,
        title: element.name + ' [EXC]',
        width: 200,
        select: true,
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
    console.log(toJS(this.props.TreetableStore.columns));
    this.setState({children: temp});
    this.setState({defaultSelects: defaultSelect});
    console.log(temp);

    window.Module._updateValueTree(1, this.state.dataShowType, 0);
    const jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
    const tableData = JSON.parse(jsonStr);

    this.setState({tableList: tableData, tablekey: this.state.tablekey + 1});
  }
  componentDidMount() {
    // const head = document.getElementById('treetableContainer');
    // const link = document.createElement('link');
    // link.type = 'text/css';
    // link.rel = 'stylesheet';
    // link.href = this.state.stylePath;
    // head.appendChild(link);
    console.log(this.viewContainer.current.clientHeight);
    console.log(this.buttons.current.clientHeight);
    console.log(this.select.current.clientHeight);
    console.log(this.treetable);
    const tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight-this.select.current.clientHeight;
    this.setState({tableHeight: tableHeight});
    this.resizeObserver = new ResizeObserver((entries) => {
      console.log('resize');
      const tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight-this.select.current.clientHeight;
      console.log(tableHeight);
      this.setState({tableHeight: tableHeight});
    });
    this.resizeObserver.observe(document.getElementById('select'));


    this.dispose = autorun(() => {
      const theme = this.props.ViewStore.theme;
      if (theme === 'dark') {
        console.log('dark');
        document.documentElement.style.setProperty('--ant-table-bg-color', '#212124');
        document.documentElement.style.setProperty('--ant-table-cell-bg-color', '#28282B');
        document.documentElement.style.setProperty('--ant-table-text-color', '#EDEDEE');
        document.documentElement.style.setProperty('--ant-table-border-color', '#212124');
        document.documentElement.style.setProperty('--ant-table-row-hover-bg-color', 'gray');
      } else {
        console.log('light');
        document.documentElement.style.removeProperty('--ant-table-bg-color');
        document.documentElement.style.setProperty('--ant-table-border-color', '#dddddd');
        document.documentElement.style.setProperty('--ant-table-cell-bg-color', '#e9e9e9');
        document.documentElement.style.removeProperty('--ant-table-text-color');
        document.documentElement.style.setProperty('--ant-table-row-hover-bg-color', '#f5f5f5');
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps);
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
    this.setState({dataShowType: 0});
  };


  changeToBottomUp = () => {
    this.setState({dataShowType: 1});
  };

  changeToFlat = () => {
    this.setState({dataShowType: 2});
  };

  render() {
    return (

      <div ref={this.viewContainer} className='h-full w-full pl-1'>
        <div ref={this.buttons} className="mt-1">
          <div className="flex pl-[0.2rem]
        h-8" role="group">
            <button
              onClick={this.changeToTopDown}
              type="button"
              className="
        rounded-l
        px-6
        py-2
        border-2 border-blue-600
        text-blue-600
        font-medium
        text-xs
        leading-tight
        uppercase
        hover:bg-black hover:bg-opacity-5
        focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out

      "
            >
      Top Down
            </button>
            <button
              onClick={this.changeToBottomUp}
              type="button"
              className="
        px-6
        py-2
        border-t-2 border-b-2 border-blue-600
        text-blue-600
        font-medium
        text-xs
        leading-tight
        uppercase
        hover:bg-black hover:bg-opacity-5
        focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out
      "
            >
      Bottom Up
            </button>
            <button
              onClick={this.changeToFlat}
              type="button"
              className="
        rounded-r
        px-6
        py-2
        border-2 border-blue-600
        text-blue-600
        font-medium
        text-xs
        leading-tight
        uppercase
        hover:bg-black hover:bg-opacity-5
        focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out
        w-28
      "
            >
      Flat
            </button>
          </div>
        </div>
        <link
          href="https://cdn.jsdelivr.net/npm/@tailwindcss/custom-forms@0.2.1/dist/custom-forms.css"
          rel="stylesheet"
        />


        <div id= "select"ref={this.select}>
          <Select />
        </div>
        <div className="ml-1 mr-1 mt-1" id = "treetableContainer">
          <Treetable ref={this.treetable} tableHeight ={this.state.tableHeight} key={this.state.tablekey} dataShowType={this.state.dataShowType} cols={toJS(this.props.TreetableStore.columns)} tableList={this.state.tableList} />
        </div>
      </div>
    );
  }
}
export default inject('TreetableStore', 'ViewStore')(observer(TreetableDataProcess));
