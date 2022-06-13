import TreeTable, { useLazyloadPlugin } from 'react-antd-treetable';
import 'antd/dist/antd.css';
import React, { Component } from 'react'

export default class TreetableTopDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys:[],
      tableList:[],
      columns:[],
      dataShowType: 0,
       metricIndex:0
      
    };
  }
  
  componentDidMount() {
    console.log(this.props)
    window.Module._updateValueTree(1, this.state.dataShowType, this.state.metricIndex);
    let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
    let tableData = JSON.parse(jsonStr);
    let jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    let MetricTypesArray = JSON.parse(jsonStr2)
    console.log(MetricTypesArray)
    this.setState({tableList:tableData})
    console.log(this.state.tableList)
    this.setState({columns:this.props.cols})
    console.log(this.state.columns)


  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.cols != this.props.cols) {
      this.setState({columns:this.props.cols})
    }
    if (prevProps.tableList != this.props.tableList) {
      this.setState({tableList:this.props.tableList})
    }
  }

  onExpandedRowsChange=(data)=>{
  //  let data = this.onLoadMore(expandedRowKeys)
    this.setState({expandedKeys:data});
    //console.log(this.state.expandedRowKeys)
  }
   onLoadMore = async record => {
     
    console.log(record)
    const res = await this.loadData(record);

   // console.log(res)
    console.log(res)
   // const res = getData();
   // console.log(typeof res)
   return res;
 };
   loadData = record =>  new Promise(resolve => {
  setTimeout(() => {
     console.log(record);
    let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(record.id);
    const children = JSON.parse(jsonStr);
    // console.log(children);
    resolve(children)
  }, 500)
});



  render() {
    return (
      <TreeTable
        rowKey="id"
        size="small"
        rowClassName={(record, index) => console.log(record)}
        expandedRowKeys={this.state.expandedKeys}
        onExpandedRowsChange={this.onExpandedRowsChange}
        dataSource={this.state.tableList}
        columns={this.state.columns}
        plugins={[
          useLazyloadPlugin({
            onLoad: this.onLoadMore,
            hasNextKey: 'hasChild',
          }),
        ]}
      />
    );
  }
}
