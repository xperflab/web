
// import React, { useState } from 'react';
// import TreeTable, { useLazyloadPlugin } from 'react-antd-treetable';
// import 'antd/dist/antd.css';
// const columns = [
//   {
//     title: '函数名',
//     dataIndex: 'function_name',
//     width: 700,
//   },
//   {
//     title: '上报次数',
//     dataIndex: 'count',
//     width: 120,
//   },
// ];

// const getData = () => {
//   return [
//     {
//       id: Math.random(),
//       function_name: `sub_function_${Math.random()}`,
//       count: 100,
//       has_next: true,
//       next_size: 10,
//     },
//     {
//       id: Math.random(),
//       function_name: `sub_function_${Math.random()}`,
//       count: 100,
//       has_next: true,
//     },
//   ];
// };

// const rootKey = Math.random();
// const data = [
//   {
//     id: rootKey,
//     function_name: `React Tree Reconciliation`,
//     count: 100,
//     has_next: true,
//   },
// ];

// const wait = time => new Promise(resolve => setTimeout(resolve, time));

// const Treetable = () => {
//   const onLoadMore = async record => {
//     console.log(record)
//     await wait(1000);
//     const res = await getData();
//     return res;
//   };

//   const [expandedKeys, setExpandedKeys] = useState([]);

//   return (
//     <TreeTable
//       rowKey="id"
//       expandedRowKeys={expandedKeys}
//       onExpandedRowsChange={setExpandedKeys}
//       dataSource={data}
//       columns={columns}
//       plugins={[
//         useLazyloadPlugin({
//           onLoad: onLoadMore,
//           hasNextKey: 'has_next',
//         }),
//       ]}
//     />
//   );
// };

//export default Treetable;
// import React, { useState, Component } from 'react';
// import TreeTable, { useLazyloadPlugin } from 'react-antd-treetable';
// import 'antd/dist/antd.css';


// const columns = [
//   {
//     title: '函数名',
//     dataIndex: 'function_name',
//     width: 700,
//   },
//   {
//     title: '上报次数',
//     dataIndex: 'count',
//     width: 120,
//   },
// ];

// const getData = () => {
//   return [
//     {
//       id: Math.random(),
//       function_name: `sub_function_${Math.random()}`,
//       count: 100,
//       has_next: true,
//       next_size: 10,
//     },
//     {
//       id: Math.random(),
//       function_name: `sub_function_${Math.random()}`,
//       count: 100,
//       has_next: true,
//     },
//   ];
// };

// const rootKey = Math.random();
// const data = [
//   {
//     id: rootKey,
//     function_name: `React Tree Reconciliation`,
//     count: 100,
//     has_next: true,
//   },
// ];

// const wait = time => new Promise(resolve => setTimeout(resolve, time));

// export default class treetable extends Component {
  
//     constructor(props) {
//     super(props);
//     this.state = {
//       expandedKeys:[]
//     };
    
//   }
  
//   componentDidUpdate(){

//   }
//   onLoadMore = async record => {
//     console.log(record)
//     await wait(1000);
//     const res = await getData();
//     return res;
//   };
//     onExpandedRowsChange=(expandedRowKeys)=>{
//   //  let data = this.onLoadMore(expandedRowKeys)
   
//     this.setState({expandedKeys:expandedRowKeys});
//     //console.log(this.state.expandedRowKeys)
//   }
//   render() {
//     return (
//       <TreeTable
//         rowKey="id"
//         expandedRowKeys={this.state.expandedKeys}
//         onExpandedRowsChange={this.onExpandedRowsChange}
//         dataSource={data}
//         columns={columns}
//         plugins={[
//           useLazyloadPlugin({
//             onLoad: this.onLoadMore,
//             hasNextKey: 'has_next',
//           }),
//         ]}
//       />
//     );
//   }
// }





import TreeTable, { useLazyloadPlugin } from 'react-antd-treetable';
import 'antd/dist/antd.css';
// const columns = [
//   {
//     title: '函数名',
//     dataIndex: 'name',
//     width: 700,
//   },
//   {
//     title: '上报次数',
//     dataIndex: 'name',
//     width: 120,
//   },
// ];
import React, { Component } from 'react'

export default class treetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys:[],
      tableList:[],
      columns:[],
      dataShowType: 1,
       metricIndex:0
      
    };
  }
  
  componentDidMount() {
    window.Module._updateValueTree(1, this.state.dataShowType, this.state.metricIndex);
    let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
    let tableData = JSON.parse(jsonStr);
    let jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    let MetricTypesArray = JSON.parse(jsonStr2)
    console.log(MetricTypesArray)
    this.setState({tableList:tableData})
    console.log(this.state.tableList)
    let cols = []
    cols.push({
      dataIndex: "name",
      title: "name"
    });
    MetricTypesArray.forEach(element => {
      cols.push({
        dataIndex: "i"+ element.id,
        title: element.name + " [INC]"
     
      });
      cols.push({
        dataIndex: "e" + element.id,
        title: element.name + " [EXC]"
        
      });
    });
    //setColumns(cols)
    this.setState({columns:cols})
    console.log(this.state.columns)


  }
  componentDidUpdate(prevProps, prevState){ 
    console.log(prevState)
    console.log(this.state)
   
   if (prevState.dataShowType != this.state.dataShowType ) {
      this.setState({expandedKeys:[]}, () => {
 
        console.log("1")
 
})
      this.setState({tableList:[]})
      window.Module._updateValueTree(1, this.state.dataShowType, this.state.metricIndex);
      let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
      let tableData = JSON.parse(jsonStr);
      let jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
      let MetricTypesArray = JSON.parse(jsonStr2)
      console.log(MetricTypesArray)
     this.setState({tableList:tableData})
  //    this.state.tableList = tableData
      console.log(this.state.tableList)
      let cols = []
      cols.push({
        dataIndex: "name",
        title: "name"
      });
      MetricTypesArray.forEach(element => {
        cols.push({
          dataIndex: "i"+ element.id,
          title: element.name + " [INC]"
       
        });
        cols.push({
          dataIndex: "e" + element.id,
          title: element.name + " [EXC]"
          
        });
      });
      //setColumns(cols)
      this.setState({columns:cols})
      console.log(this.state.columns)
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

changeToTopDown=()=>{
  //this.state.dataShowType = 1;
  //this.drawFlameGraph(0,  this.state.metricIndex, "")
  this.setState({dataShowType : 0})
}


changeToBottomUp=()=>{
  //this.state.dataShowType = 1;

  this.setState({dataShowType : 1});
  console.log(this.state.dataShowType)
 // console.log(this.state.dataShowType)
 //  window.onresize = this.onWindowResize;
  //this.drawFlameGraph(this.state.dataShowType,  this.state.metricIndex, "")
}

changeToFlat=()=>{
  //this.state.dataShowType = 1;
 // this.drawFlameGraph(2,  this.state.metricIndex, "")
 this.setState({dataShowType : 2})
}


  render() {
    return (
      <div>          <button
              type="button"
              onClick={this.changeToTopDown}
              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Top Down
            </button>
            <button
              type="button"
              onClick ={this.changeToBottomUp}
              className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Bottom Up
            </button>
            <button
              type="button"
              onClick ={this.changeToFlat}
              className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Flat
            </button>
      <TreeTable
        rowKey="id"
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
      /></div>
    );
  }
}







// const Treetable = () => {

//   const [columns, setColumns] = useState([])
//   const [tableList, settableList] = useState([])


//   // useEffect(() => {
//   //   setColumns(columns)
    
//   // },[columns]);
//   // useEffect(() => {
//   //   // 使用浏览器的 API 更新页面标题
//   //   settableList(tableList)
//   // },[tableList]);
//   const [expandedKeys, setExpandedKeys] = useState([]);


  

  
// };


/**
 * cn - 树形数据
 *    -- 支持树形数据的展示，通过 columns.treeColumnsName 指定子数据字段名，同时在该列自动添加 展开/收起 按钮。\n 通过 columns.treeIndent 指定每一层缩进宽度。\n 备注：当展开列内容过长时，单元格会自动换行。可以通过 width 设定足够的长度来避免。
 * en - Tree Data
 *    -- Support Tree Data.
 */
/**
 * cn - 树形数据
 *    -- 支持树形数据的展示，通过 columns.treeColumnsName 指定子数据字段名，同时在该列自动添加 展开/收起 按钮。\n 通过 columns.treeIndent 指定每一层缩进宽度。\n 备注：当展开列内容过长时，单元格会自动换行。可以通过 width 设定足够的长度来避免。
 * en - Tree Data
 *    -- Support Tree Data.
 */
//  import React, { useState, Component} from 'react';
// import 'antd/dist/antd.css';
// //import './index.css';
// import { Space, Switch, Table } from 'antd';

// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     key: 'age',
//     width: '12%',
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     width: '30%',
//     key: 'address',
//   },
// ];
// const data = [
//   {
//     key: 1,
//     name: 'John Brown sr.',
//     age: 60,
//     address: 'New York No. 1 Lake Park',
//     children: [
//       {
//         key: 11,
//         name: 'John Brown',
//         age: 42,
//         address: 'New York No. 2 Lake Park',
//       },
//       {
//         key: 12,
//         name: 'John Brown jr.',
//         age: 30,
//         address: 'New York No. 3 Lake Park',
//         children: [
//           {
//             key: 121,
//             name: 'Jimmy Brown',
//             age: 16,
//             address: 'New York No. 3 Lake Park',
//           },
//         ],
//       },
//       {
//         key: 13,
//         name: 'Jim Green sr.',
//         age: 72,
//         address: 'London No. 1 Lake Park',
//         children: [
//           {
//             key: 131,
//             name: 'Jim Green',
//             age: 42,
//             address: 'London No. 2 Lake Park',
//             children: [
//               {
//                 key: 1311,
//                 name: 'Jim Green jr.',
//                 age: 25,
//                 address: 'London No. 3 Lake Park',
//               },
//               {
//                 key: 1312,
//                 name: 'Jimmy Green sr.',
//                 age: 18,
//                 address: 'London No. 4 Lake Park',
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     key: 2,
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//   },
// ]; // rowSelection objects indicates the need for row selection



// export default class Treetable extends Component  {
//   // const [checkStrictly, setCheckStrictly] = useState(false);
//     state = {
//     treeValue: "",
//     dataShowType: 0,
//     metricIndex:0
//   };


//   componentWillMount(){
//     Module._updateValueTree(1, this.state.dataShowType, this.state.metricIndex);
//     let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
//     let tableList = JSON.parse(jsonStr);
//     let jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
//     let MetricTypesArray = JSON.parse(jsonStr2)
//     console.log(MetricTypesArray)
//    // this.state.treeValue = TreeState.create(tableList)
//    console.log(tableList)
//     console.log(this.state.treeValue)
// }
//   render() {
//   return (
//     <>
//       <Table
//         columns={columns}
//         dataSource={data}
//         scroll={{ x: true }}
//       />
//     </>
//   );}
// };



// import React, { Component } from 'react';

// import { TreeTable, TreeState } from 'cp-react-tree-table';

// const MOCK_DATA = [
  
//   {
//     data: {id: 31, parentId: null, hasChild: true, name: 'runtime.gcBgMarkWorker:L1945', i0: '37.99% (4.6500e+02)' },

//   },
//   {
//     data: {id: 1694, parentId: null, hasChild: true, name: 'runtime.main:L204', i0: '29.58% (3.6200e+02)'}
//   }
 
// ];

// export default class Treetable extends Component {
 
//   state = {
//     treeValue: "",
//     dataShowType: 0,
//     metricIndex:0
//   };


//   componentWillMount(){
//     Module._updateValueTree(1, this.state.dataShowType, this.state.metricIndex);
//     let jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
//     let tableList = JSON.parse(jsonStr);
//     let jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
//     let MetricTypesArray = JSON.parse(jsonStr2)
//     console.log(MetricTypesArray)
//    // this.state.treeValue = TreeState.create(tableList)
//    console.log(tableList)
//     this.state.treeValue = TreeState.create(tableList)
//     console.log(this.state.treeValue)
// }
//   render() {
    
//     return (
//       <div>
//             <button
//         type="button"
//         onClick={this.changeToTopDown}
//         className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//       >
//         Top Down
//       </button>
//       <button
//         type="button"
//         onClick ={this.changeToBottomUp}
//         className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//       >
//         Bottom Up
//       </button>
//       <button
//         type="button"
//         onClick ={this.changeToFlat}
//         className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//       >
//         Flat
//       </button>
//       <div className="wrapper">

//         <div className="controls">
//           <div className="control-section">
//           </div>
//         </div>

//         <TreeTable className="demo-tree-table"
//           height="360"
//           headerHeight="32"

//           value={this.state.treeValue}
//           onChange={this.handleOnChange}

//           ref={this.treeTableRef}
//           onScroll={this.handleOnScroll}>
//           <TreeTable.Column renderCell={this.renderIndexCell} renderHeaderCell={this.renderHeaderCell('Name')} basis="180px" grow="0"/>
        
//         </TreeTable>
//       </div>
//       </div>
//     );
//   }

//   handleOnChange = (newValue) => {
//     console.log('newValue', newValue)
//     this.setState({ treeValue: newValue });
//   }

//   handleOnScroll = (newValue) => {
//     console.log('onScroll', newValue)
//   }



//   handleScrollTo = () => {
//     console.log('Scroll to "1000px"');
//     if (this.treeTableRef.current != null) {
//       this.treeTableRef.current.scrollTo(1000);
//     }
//   }



//   renderHeaderCell = (name, alignLeft = true) => {
//     return () => {
//       return (
//         <span className={alignLeft ? 'align-left' : 'align-right'}>{name}</span>
//       );
//     }
//   }

//   renderIndexCell =(row) => {
//    console.log(row)
//     return (
//       // <div>
//       //   <button className={`toggle-button ${row.$state.isExpanded ? 'expanded' : ''}`}
//       //     onClick={row.toggleChildren}>
//       //     <div style={{overflow:'hidden', whiteSpace:'nowrap' ,textOverflow:'ellipsis'}}></div><span>{row.data.name}</span>
//       //   </button>
//       // </div>
//       <div style={{ paddingLeft: (row.metadata.depth * 15) + 'px'}}>
//       <button className={`toggle-button ${row.$state.isExpanded ? 'expanded' : ''}`}
//         onClick={row.toggleChildren}>
//          <div style={{overflow:'hidden', whiteSpace:'nowrap' ,textOverflow:'ellipsis'}}><span>{row.data.name}</span></div>
//       </button>
//     </div>
//     );
//   }


// }
  