import 'antd/dist/antd.min.css';
import { Component } from 'react';
import TreeTable, { useLazyloadPlugin } from 'react-antd-treetable';
import { getTreeTableChildrenList } from '../compoents/ezview';


export default class TreetableTopDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
    };
  }

  onExpandedRowsChange = (data) => {
    //  let data = this.onLoadMore(expandedRowKeys)
    this.setState({ expandedKeys: data });
    //console.log(this.state.expandedRowKeys)
  }

  onLoadMore = async record => {
    console.log(record)
    const res = await this.loadData(record);
    return res;
  };

  loadData = record => new Promise(resolve => {
    setTimeout(async () => {
      let jsonStr = await getTreeTableChildrenList(record.id);
      const children = JSON.parse(jsonStr);
      // console.log(children);
      resolve(children)
    }, 200)
  });



  render() {
    return (
      <TreeTable
        rowKey="id"
        size="small"
        expandedRowKeys={this.state.expandedKeys}
        onExpandedRowsChange={this.onExpandedRowsChange}
        dataSource={this.props.tableList}
        columns={this.props.cols}
        scroll={{ y: this.props.tableHeight, x: 1000 }}
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
