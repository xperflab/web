import {
    SearchIcon
  } from '@heroicons/react/solid';
  import React from 'react';
  import { Component } from "react";
  import '../components-css/flame_graph.css';

  
  export default class FlameGraph extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isFull: false,
        isShow: false,
        isProcessLoading: true,
        global: {},
        metricTypesArray: [],
        focusNode: {
        },
        dataShowType: 0,
        metricIndex: 0,
        filterName: '',
        value: '',
      };
    }
  
    render() {
      return (
        <div>
          <form className="w-full flex lg:ml-0" onSubmit={this.handleSubmit}>
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input type="text" className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                value={this.state.value} onChange={this.handleChange} placeholder="Search"
              />
            </div>
          </form>
          <span className="relative z-0 inline-flex shadow-sm rounded-md">
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
          </span>
          <div>
            <select
              id="location"
              name="location"
              onChange={this.handleChangeMetricIndex}
              className="mt-1 block w-200 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
  
              {this.state.metricTypesArray.map(metricType => <option key={metricType.id}>{metricType.name}</option>)}
  
            </select>
            {/* <Select options={this.state.focusNode.metricTypesArray[0].name} /> */}
  
          </div>
          {/* <div className="grid grid-cols-6 gap-x-1 "> */}
          <div >
            <div className="col-start-2 col-span-4">
              <div id="details" className="details">
                VIRTUAL ROOT
              </div>
            </div>
            <div className="col-start-2 col-span-4">
              <div className="details"></div>
            </div>
            <div id="viewContainer"  ref={this.viewContainer} className="col-start-2 col-span-4"style={{height:1500}} >
              <canvas id="renderView" ref ={this.renderview} className="canvas">
  </canvas>
            </div>
            <div className="col-start-2 col-span-4">
              <div style={{ position: "relative", height: 0 }}>
                <div id="renderContainer" style={{ position: "absolute", pointerEvents: "none" }}>
                  <div id="renderTexts" style={{ position: "relative", height: 0, width: 0 }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  