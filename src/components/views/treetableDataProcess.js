/* eslint-disable require-jsdoc */
/* eslint-disable react/no-deprecated */
/* eslint-disable max-len */

import 'antd/dist/antd.min.css';
import {Select} from 'antd';
import {Component} from 'react';
import Treetable from './treetable';
import '../views-css/treetable.css';
import React from 'react';
import {Fragment, useState} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid';
const {Option} = Select;
const people = [
  {id: 1, name: 'Wade Cooper', online: true},
  {id: 2, name: 'Arlene Mccoy', online: false},
  {id: 3, name: 'Devon Webb', online: false},
  {id: 4, name: 'Tom Cook', online: true},
  {id: 5, name: 'Tanya Fox', online: false},
  {id: 6, name: 'Hellen Schmidt', online: true},
  {id: 7, name: 'Caroline Schultz', online: true},
  {id: 8, name: 'Mason Heaney', online: false},
  {id: 9, name: 'Claudie Smitham', online: true},
  {id: 10, name: 'Emil Schaefer', online: false},
];
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
function Example() {
  const [selected, setSelected] = useState(people[3]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({open}) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">Assigned to</Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <span
                  aria-label={selected.online ? 'Online' : 'Offline'}
                  className={classNames(
                    selected.online ? 'bg-green-400' : 'bg-gray-200',
                    'flex-shrink-0 inline-block h-2 w-2 rounded-full',
                  )}
                />
                <span className="ml-3 block truncate">{selected.name}</span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({active}) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
                      )
                    }
                    value={person}
                  >
                    {({selected, active}) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              person.online ? 'bg-green-400' : 'bg-gray-200',
                              'flex-shrink-0 inline-block h-2 w-2 rounded-full',
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {person.name}
                            <span className="sr-only"> is {person.online ? 'online' : 'offline'}</span>
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
export default class TreetableDataProcess extends Component {
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
    this.viewContainer = React.createRef();
    this.buttons = React.createRef();
    this.select = React.createRef();
  }

  componentWillMount() {
    const temp = [];
    const defaultSelect =[];
    const jsonStr2 = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    const MetricTypesArray = JSON.parse(jsonStr2);
    console.log(MetricTypesArray);
    const cols = [];
    cols.push({
      dataIndex: 'name',
      title: 'name',
      width: 600,
      ellipsis: true,

    });
    MetricTypesArray.forEach((element) => {
      cols.push({
        dataIndex: 'i' + element.id,
        title: element.name + ' [INC]',
        width: 100,
        onHeaderCell: (column) => {
          return {
            onClick: () => {
              console.log(column);
              console.log(element);
              const metricIdx = parseInt(element.id);
              const valueType = 0;
              window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
              const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
              const dataList = JSON.parse(jsonStr);
              console.log(dataList);
              this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
            },
          };
        },

      });
      cols.push({
        dataIndex: 'e' + element.id,
        title: element.name + ' [EXC]',
        width: 100,
        onHeaderCell: (column) => {
          return {
            onClick: () => {
              console.log(column);
              console.log(element);
              const metricIdx = parseInt(element.id);
              console.log(metricIdx);
              const valueType = 1;
              window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
              const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
              const dataList = JSON.parse(jsonStr);
              console.log(dataList);
              this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
            },
          };
        },

      });
    });
    this.setState({metricArray: MetricTypesArray});
    this.setState({columns: cols});
    for (let i = 1; i < cols.length; i++) {
      temp.push(<Option key={cols[i].dataIndex}>{cols[i].title}</Option>);
      defaultSelect.push(cols[i].dataIndex);
    }
    this.setState({children: temp});
    this.setState({defaultSelects: defaultSelect});
    console.log(temp);

    window.Module._updateValueTree(1, this.state.dataShowType, 0);
    const jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
    const tableData = JSON.parse(jsonStr);

    this.setState({tableList: tableData, tablekey: this.state.tablekey + 1});
  }
  componentDidMount() {
    console.log(this.viewContainer.current.clientHeight);
    console.log(this.buttons.current.clientHeight);
    console.log(this.select.current.clientHeight);
    const tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight-this.select.current.clientHeight;
    this.setState({tableHeight: tableHeight});
    this.resizeObserver = new ResizeObserver((entries) => {
      console.log('resize');
      const tableHeight = this.viewContainer.current.clientHeight - this.buttons.current.clientHeight-this.select.current.clientHeight;
      this.setState({tableHeight: tableHeight});
    });
    this.resizeObserver.observe(document.getElementById('select'));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataShowType != this.state.dataShowType) {
      window.Module._updateValueTree(1, this.state.dataShowType, 0);
      const jsonStr = Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
      const tableData = JSON.parse(jsonStr);

      this.setState({tableList: tableData, tablekey: this.state.tablekey + 1});
    }
  }
  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  changeToTopDown = () => {
    // this.state.dataShowType = 1;
    // this.drawFlameGraph(0,  this.state.metricIndex, "")
    this.setState({dataShowType: 0});
  };


  changeToBottomUp = () => {
    this.setState({dataShowType: 1});
  };

  changeToFlat = () => {
    this.setState({dataShowType: 2});
  };
  handleChange = (value) => {
    console.log(value);
    console.log(this.state.metricArray);
    const cols = [];
    cols.push({
      dataIndex: 'name',
      title: 'name',
      width: 600,
      ellipsis: true,
    });
    this.state.metricArray.forEach((element) => {
      const index = 'i' + element.id;
      if (value.includes(index)) {
        cols.push({
          dataIndex: 'i' + element.id,
          title: element.name + ' [INC]',
          width: 100,
          onHeaderCell: (column) => {
            return {
              onClick: () => {
                console.log(column);
                console.log(element);
                const metricIdx = parseInt(element.id);
                const valueType = 0;
                window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
                const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
                const dataList = JSON.parse(jsonStr);
                this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
              },
            };
          },

        });
      }
      const index2 = 'e' + element.id;
      if (value.includes(index2)) {
        cols.push({
          dataIndex: 'e' + element.id,
          title: element.name + ' [EXC]',
          width: 100,
          onHeaderCell: (column) => {
            return {
              onClick: () => {
                console.log(column);
                console.log(element);
                const metricIdx = parseInt(element.id);
                console.log(metricIdx);
                const valueType = 1;
                window.Module._sortContextTreeByMetricIdx(valueType, metricIdx);
                const jsonStr = window.Module.cwrap('getTreeTableChildrenList', 'string', ['number'])(2);
                const dataList = JSON.parse(jsonStr);
                console.log(dataList);
                this.setState({tableList: dataList, tablekey: this.state.tablekey + 1});
              },
            };
          },

        });
      }
    });
    console.log(cols);
    this.setState({columns: cols});
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
        <div id= "select"ref={this.select}>
          <Select

            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            defaultValue={this.state.defaultSelects}
            onChange={this.handleChange}
          >
            {this.state.children}
          </Select>
          <Example/>
        </div>
        <div><Treetable tableHeight ={this.state.tableHeight} key={this.state.tablekey} dataShowType={this.state.dataShowType} cols={this.state.columns} tableList={this.state.tableList} /></div>
      </div>
    );
  }
}


