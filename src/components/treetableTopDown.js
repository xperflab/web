import 'antd/dist/antd.min.css';
import { Component } from 'react';
import TreeTable, { useLazyloadPlugin } from 'react-antd-treetable';


export default class TreetableTopDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
    };
  }


  render() {
    return (
      <TreeTable
        rowKey="id"
        size="small"
        expandedRowKeys={this.state.expandedKeys}
        onExpandedRowsChange={this.onExpandedRowsChange}
        dataSource={this.props.tableList}
        columns={this.props.cols}
        scroll={{y:550,x:1000}}
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
