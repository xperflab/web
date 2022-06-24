import 'antd/dist/antd.min.css';
import {Component, React} from 'react';
import TreeTable, {useLazyloadPlugin} from 'react-antd-treetable';
import PropTypes from 'prop-types';
/**
 * Treetable component implement by antd,
 * updates to newest antd version will cause a bug, and thus don't change the version of antd in package.json
 */
export default class TreetableComponent extends Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    TreetableComponent.propTypes = {
      tableList: PropTypes.array,
      columns: PropTypes.array,
    };
    this.state = {
      expandedKeys: [],
    };
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <TreeTable
        rowKey="id"
        size="small"
        expandedRowKeys={this.state.expandedKeys}
        onExpandedRowsChange={this.onExpandedRowsChange}
        dataSource={this.props.tableList}
        columns={this.props.columns}
        scroll={{y: 550, x: 1000}}
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
