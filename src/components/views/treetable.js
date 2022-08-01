/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.min.css';
import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import TreeTable, {useLazyloadPlugin} from 'react-antd-treetable';
import {toJS} from 'mobx';

class Treetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      columns: props.cols,
    };
  }
  componentDidMount() {
    const column = this.props.TreetableStore.columns;
    console.log(column);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cols !== this.props.cols) {
      console.log('update');
      this.setState({
        columns: this.props.cols.filter((col)=>col.select === true),
      });
    }
  }

  onExpandedRowsChange = (data) => {
    this.setState({expandedKeys: data});
  };

  onLoadMore = async (record) => {
    console.log(record);
    const res = await this.loadData(record);
    return res;
  };

  loadData = (record) => new Promise((resolve) => {
    setTimeout(() => {
      console.log(record);
      const jsonStr = Module.cwrap('getTreeTableChildrenList',
          'string', ['number'])(record.id);
      const children = JSON.parse(jsonStr);
      // console.log(children);
      resolve(children);
    }, 200);
  });


  render() {
    return (
      <TreeTable
        rowKey="id"
        bordered
        size="small"
        expandedRowKeys={this.state.expandedKeys}
        onExpandedRowsChange={this.onExpandedRowsChange}
        dataSource={this.props.tableList}
        columns={this.state.columns}
        scroll={{y: this.props.tableHeight, x: 1000}}
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
export default inject('TreetableStore')(observer(Treetable));
