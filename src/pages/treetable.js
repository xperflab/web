
import 'antd/dist/antd.min.css';
import { Select } from "antd";
import { Component } from 'react';
import TreetableTopDown from './treetableTopDown';
const { Option } = Select;

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

  componentDidMount() {
    let temp = []
    let jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    let MetricTypesArray = JSON.parse(jsonStr2)
    console.log(MetricTypesArray)
    let cols = []
    cols.push({
      dataIndex: "name",
      title: "name",
      fixed:"left",
      width:"300",
      ellipsis: true,

    });
    MetricTypesArray.forEach(element => {
      cols.push({
        dataIndex: "i" + element.id,
        title: element.name + " [INC]",
        onHeaderCell: (column) => {
          return {
            onClick: () => {
              console.log(column);
              console.log(element);
              let metricIdx = parseInt(element.id);
              let valueType = 0;
              window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
              let jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
              let dataList = JSON.parse(jsonStr)
              console.log(dataList)
              this.setState({ tableList: dataList, tablekey: this.state.tablekey + 1 })
            }
          };
        }

      });
      cols.push({
        dataIndex: "e" + element.id,
        title: element.name + " [EXC]",
        onHeaderCell: (column) => {
          return {
            onClick: () => {
              console.log(column);
              console.log(element);
              let metricIdx = parseInt(element.id);
              console.log(metricIdx)
              let valueType = 1;
              window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
              let jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
              let dataList = JSON.parse(jsonStr)
              console.log(dataList)
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
    }
    this.setState({ children: temp })
    this.setState({ defaultSelects: temp })

    window.Module._updateValueTree(1, this.state.dataShowType, 0);
    let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
    const tableData = JSON.parse(jsonStr);

    this.setState({ tableList: tableData, tablekey: this.state.tablekey + 1 })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataShowType != this.state.dataShowType) {
      window.Module._updateValueTree(1, this.state.dataShowType, 0);
      let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
      const tableData = JSON.parse(jsonStr);

      this.setState({ tableList: tableData, tablekey: this.state.tablekey + 1 })
    }
  }


  changeToTopDown = () => {
    //this.state.dataShowType = 1;
    //this.drawFlameGraph(0,  this.state.metricIndex, "")
    this.setState({ dataShowType: 0 })
  }


  changeToBottomUp = () => {
    //this.state.dataShowType = 1;

    this.setState({ dataShowType: 1 });
    console.log(this.state.dataShowType)
    // console.log(this.state.dataShowType)
    //  window.onresize = this.onWindowResize;
    //this.drawFlameGraph(this.state.dataShowType,  this.state.metricIndex, "")
  }

  changeToFlat = () => {
    //this.state.dataShowType = 1;
    // this.drawFlameGraph(2,  this.state.metricIndex, "")
    this.setState({ dataShowType: 2 })
  }
  handleChange = (value) => {
    console.log(value)
    console.log(this.state.metricArray)
    let cols = []
    cols.push({
      dataIndex: "name",
      title: "name",

    });
    cols.push({
      dataIndex: "abb",
      title: "123",

    });
    this.state.metricArray.forEach(element => {
      let index = "i" + element.id;
      if (value.includes(index)) {
        cols.push({
          dataIndex: "i" + element.id,
          title: element.name + " [INC]",
          onHeaderCell: (column) => {
            return {
              onClick: () => {
                console.log(column);
                console.log(element);
                let metricIdx = parseInt(element.id);
                let valueType = 0;
                window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
                let jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
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
          onHeaderCell: (column) => {
            return {
              onClick: () => {
                console.log(column);
                console.log(element);
                let metricIdx = parseInt(element.id);
                console.log(metricIdx)
                let valueType = 1;
                window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
                let jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
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






