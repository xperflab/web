/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import {React} from 'react';
import 'antd/dist/antd.min.css';
import TreeTable, {useLazyloadPlugin} from 'easyview-antd-treetable';
import {inject, observer} from 'mobx-react';
import {Component} from 'react';
/**
 *  inject('TreetableStore')
 *
 */
class Treetable extends Component {
  /**
   *
   * @param {props} props
   */
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      expandedKeys: [],
      columns: props.cols,
    };
  }
  componentDidUpdate(prevProps) {
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
    }, 0);
  });


  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <TreeTable
        rowKey="id"
        size="small"
        expandedRowKeys={this.state.expandedKeys}
        onExpandedRowsChange={this.onExpandedRowsChange}
        dataSource={this.props.tableList}
        columns={this.state.columns}
        scroll={{y: '740px', x: 1000}}
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
