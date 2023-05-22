
import 'antd/dist/antd.min.css';
import { Select } from "antd";
import { Component } from 'react';
import TreetableTopDown from './treetableTopDown';
import { LeftCircleFilled } from '@ant-design/icons';
import '../pages-css/treetable.css';
import React from 'react';
const { Option } = Select;
import { message } from "antd";

import { updateValueTree, getRootID, getMetricDesJsonStr, getTreeTableChildrenList, initFlatTree, initBUTree, sortContextTreeByMetricIdx } from '../compoents/ezview';


let root_id

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
      tableHeight: 550,
    };
    root_id = getRootID()
    this.viewContainer = React.createRef()
    this.buttons = React.createRef()
    this.select = React.createRef()
  }

  componentWillMount() {
    let temp = []
    let defaultSelect = []
    let jsonStr2 = getMetricDesJsonStr();
    let MetricTypesArray = JSON.parse(jsonStr2)
    let cols = []
    cols.push({
      dataIndex: "name",
      title: "name",
      width: 600,
      ellipsis: true,

    });
    MetricTypesArray.forEach(element => {
      cols.push({
        dataIndex: "i" + element.id,
        title: element.name + " [INC]",
        width: 100,
        onHeaderCell: (column) => {
          return {
            onClick: async () => {
              let metricIdx = parseInt(element.id);
              let valueType = 0;
              sortContextTreeByMetricIdx(valueType, metricIdx);
              let jsonStr = await getTreeTableChildrenList(root_id);
              let dataList = JSON.parse(jsonStr)
              this.setState({ tableList: dataList, tablekey: this.state.tablekey + 1 })
            }
          };
        }

      });
      cols.push({
        dataIndex: "e" + element.id,
        title: element.name + " [EXC]",
        width: 100,
        onHeaderCell: (column) => {
          return {
            onClick: async () => {
              let metricIdx = parseInt(element.id);
              let valueType = 1;
              sortContextTreeByMetricIdx(valueType, metricIdx);
              let jsonStr = await getTreeTableChildrenList(root_id);
              let dataList = JSON.parse(jsonStr)
              this.setState({ tableList: dataList, tablekey: this.state.tablekey + 1 })
            }
          };
        }

      });
    });
    this.setState({ metricArray: MetricTypesArray })
    this.setState({ columns: cols })
    for (let i = 1; i < cols.length; i++) {
      temp.push(<Option key={cols[i].dataIndex}>{cols[i].title}</Option>);
      defaultSelect.push(cols[i].dataIndex)
    }
    this.setState({ children: temp })
    this.setState({ defaultSelects: defaultSelect })

    updateValueTree(1, this.state.dataShowType, 0).then(async () => {
      let jsonStr = await getTreeTableChildrenList(root_id);
      const tableData = JSON.parse(jsonStr);

      this.setState({ tableList: tableData, tablekey: this.state.tablekey + 1 })
    })
    
  }
  componentDidMount() {
    let tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight - this.select.current.clientHeight
    this.setState({ tableHeight: tableHeight })
    this.resizeObserver = new ResizeObserver(entries => {
      let tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight - this.select.current.clientHeight
      this.setState({ tableHeight: tableHeight })
    });
    this.resizeObserver.observe(document.getElementById("select"));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataShowType != this.state.dataShowType) {
      // Notice that updateValueTree is a async operation
      updateValueTree(1, this.state.dataShowType, 0).then(async e => {
        let jsonStr = await getTreeTableChildrenList(root_id);
        const tableData = JSON.parse(jsonStr);
        this.setState({ tableList: tableData, tablekey: this.state.tablekey + 1 })
      })
    }
  }
  
  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  changeToTopDown = () => {
    message.success("Change to top-down")
    this.setState({ dataShowType: 0 })
  }

  changeToBottomUp = () => {
    message.success("Change to bottom-up")
    this.setState({ dataShowType: 1 })
  }

  changeToFlat = () => {
    message.success("Change to flat")
    this.setState({ dataShowType: 2 })
  }


  handleChange = (value) => {
    let cols = []
    cols.push({
      dataIndex: "name",
      title: "name",
      width: 600,
      ellipsis: true,
    });
    this.state.metricArray.forEach(element => {
      let index = "i" + element.id;
      if (value.includes(index)) {
        cols.push({
          dataIndex: "i" + element.id,
          title: element.name + " [INC]",
          width: 100,
          onHeaderCell: (column) => {
            return {
              onClick: async () => {
                console.log(column);
                console.log(element);
                let metricIdx = parseInt(element.id);
                let valueType = 0;
                sortContextTreeByMetricIdx(valueType, metricIdx);
                let jsonStr = await getTreeTableChildrenList(root_id);
                let dataList = JSON.parse(jsonStr)
                this.setState({ tableList: dataList, tablekey: this.state.tablekey + 1 })
              }
            };
          }

        });
      }
      let index2 = "e" + element.id;
      if (value.includes(index2)) {
        cols.push({
          dataIndex: "e" + element.id,
          title: element.name + " [EXC]",
          width: 100,
          onHeaderCell: (column) => {
            return {
              onClick: async () => {
                console.log(column);
                console.log(element);
                let metricIdx = parseInt(element.id);
                console.log(metricIdx)
                let valueType = 1;
                sortContextTreeByMetricIdx(valueType, metricIdx);
                let jsonStr = await getTreeTableChildrenList(root_id);
                let dataList = JSON.parse(jsonStr)
                console.log(dataList)
                this.setState({ tableList: dataList, tablekey: this.state.tablekey + 1 })
              }
            };
          }

        });
      }

    });
    console.log(cols)
    this.setState({ columns: cols })
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
        <div id="select" ref={this.select}>
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
        </div>
        <div><TreetableTopDown tableHeight={this.state.tableHeight} key={this.state.tablekey} dataShowType={this.state.dataShowType} cols={this.state.columns} tableList={this.state.tableList} /></div>

      </div>
    );
  }
}






