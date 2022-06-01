import React, { Component } from 'react';

import { TreeTable, TreeState } from 'cp-react-tree-table';

const MOCK_DATA = [
  
  {
    data: {id: 31, parentId: null, hasChild: true, name: 'runtime.gcBgMarkWorker:L1945', i0: '37.99% (4.6500e+02)' },

  },
  {
    data: {id: 1694, parentId: null, hasChild: true, name: 'runtime.main:L204', i0: '29.58% (3.6200e+02)'}
  }
 
];

export default class Treetable extends Component {
 
  state = {
    treeValue: ""
  };

  treeTableRef = React.createRef();
  componentWillMount(){
    Module._updateValueTree(1, 0, 0);
    let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
    let tableList = JSON.parse(jsonStr);
    let jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    let MetricTypesArray = JSON.parse(jsonStr2)
    console.log(MetricTypesArray)
   // this.state.treeValue = TreeState.create(tableList)
   console.log(tableList)
    this.state.treeValue = TreeState.create(MOCK_DATA)
    console.log(this.state.treeValue)
}
  render() {
    
    return (
      <div className="wrapper">

        <div className="controls">
          <div className="control-section">
          </div>
        </div>

        <TreeTable className="demo-tree-table"
          height="360"
          headerHeight="32"

          value={this.state.treeValue}
          onChange={this.handleOnChange}

          ref={this.treeTableRef}
          onScroll={this.handleOnScroll}>
          <TreeTable.Column renderCell={this.renderIndexCell} renderHeaderCell={this.renderHeaderCell('Name')} basis="180px" grow="0"/>
        </TreeTable>
      </div>
    );
  }

  handleOnChange = (newValue) => {
    console.log('newValue', newValue)
    this.setState({ treeValue: newValue });
  }

  handleOnScroll = (newValue) => {
    console.log('onScroll', newValue)
  }



  handleScrollTo = () => {
    console.log('Scroll to "1000px"');
    if (this.treeTableRef.current != null) {
      this.treeTableRef.current.scrollTo(1000);
    }
  }



  renderHeaderCell = (name, alignLeft = true) => {
    return () => {
      return (
        <span className={alignLeft ? 'align-left' : 'align-right'}>{name}</span>
      );
    }
  }

  renderIndexCell =(row) => {
    console.log(row)
    return (
      <div>
        <button className={`toggle-button ${row.$state.isExpanded ? 'expanded' : ''}`}
          onClick={row.toggleChildren}>
          <span>{row.data.name}</span>
        </button>
      </div>
    );
  }


}
  