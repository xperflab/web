import React, { Component } from "react";
import PropTypes from "prop-types";
import XEUtils, { filter } from "xe-utils";
import * as PIXI from "pixi.js";
import '../pages-css/flame_graph.css';
import Search from "../compoents/search";
import Select from 'react-select';
import {
  BellIcon,
  CalendarIcon,
  ChatAltIcon,
  CheckCircleIcon,
  LockOpenIcon,
  PencilIcon,
  SearchIcon,
  TagIcon,
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/solid'
import { FullScreen} from "react-full-screen";
function str2ab(str) {
    var buf = new ArrayBuffer(str.length); 
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

export default class FlameGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFull: false,
      isShow:false,
      isProcessLoading: true,
      global: {},
      metricTypesArray:[] ,
      focusNode: {
        dataShowType : 0,
        metricIndex : 0,
        filterName:''
      },
      value:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    height: PropTypes.number
  };
  static defaultProps = {
    height: 1500
  };

  componentDidMount() {
    console.log("Mount")

   
   // this.state.focusNode.dataShowType = 0;
   // this.state.focusNode.metricIndex = 0;
    this.state.focusNode.id = 2;
    this.state.focusNode.x = 0;
    this.state.focusNode.y = 0;
    this.state.focusNode.hovorId = 2;
    this.state.global.messageDetails = document.getElementById("details");
    this.state.global.container = document.getElementById("viewContainer");
    this.state.global.textsRender = document.getElementById("renderContainer");
    this.state.global.viewStyle = window.getComputedStyle(
      this.state.global.container,
      null
    );
    this.state.global.width =
      parseInt(this.state.global.viewStyle.width) -
      2 * parseInt(this.state.global.viewStyle.paddingLeft) -
      2 * parseInt(this.state.global.viewStyle.marginLeft);
    let bgColor = this.state.global.viewStyle.backgroundColor.match(/\d+/g);

    function ColorToHex(color) {
      var hexadecimal = color.toString(16);
      return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    }

    function ConvertRGBtoHex(red, green, blue) {
      return "0x" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
    }



    this.state.global.textsTop = -this.props.height;
    this.state.global.textsRender.style.top = this.state.global.textsTop + "px";
    this.state.global.textsRender.style.width = this.state.global.width + "px";
    this.state.global.textsRender.style.height = this.props.height + "px";
    this.state.global.texts = document.getElementById("renderTexts");
    this.state.global.app = new PIXI.Application({
      view: document.getElementById("renderView"),
      width: this.state.global.width,
      height: this.props.height,
      backgroundColor: ConvertRGBtoHex(
        parseInt(255),
        parseInt(255),
        parseInt(255)
      )
    });
    this.state.global.container.appendChild(this.state.global.app.view);

          window.Module._setUpDrawFlameGraph(-1, window.Module.addFunction(this.drawRectNode, 'viiiiiji'));
          window.onresize = this.onWindowResize;
          let jsonStr = window.Module.cwrap('getMetricDesJsonStr', 'string')();
          console.log(jsonStr)
          // this.state.metricTypesArray = JSON.parse(jsonStr);
          this.setState({metricTypesArray:JSON.parse(jsonStr)})
          console.log(this.state.metricTypesArray[0])
          console.log("3")
          this.drawFlameGraph(this.state.focusNode.dataShowType, this.state.focusNode.metricIndex, "");
          
          window.addEventListener("message", (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
              case "drawClickNode": {
                console.log(this);
                this.state.global.texts.innerHTML = '';
                this.state.global.app.stage.removeChildren();
                this.state.focusNode.id = message.data.id;
                this.state.focusNode.x = message.data.x;
                this.state.focusNode.y = message.data.y;
                console.log(message.data)
                console.log(this.state.global.width)
                console.log("2")
                window.Module._drawFlameGraphClickNode(message.data.id, message.data.x, message.data.y, this.state.global.width, message.data.h);
                let clickNodeMessageStr = window.Module.cwrap('getClickNodeMessage', 'string', ['number', 'number', 'number'])(this.state.focusNode.id, 0, this.state.focusNode.metricIndex);
                let obj = JSON.parse(clickNodeMessageStr);
                break;
            }
            case "changeMessageDetails": {
              // console.log(message.type);
              this.state.focusNode.hovorId = message.data.id;
              this.state.global.messageDetails.innerHTML = Module.cwrap('getContextDetails', 'string', ['number'])(this.state.focusNode.hovorId);
              break;
          }
            }
          }
          )
  }
  componentDidUpdate(prevProps, prevState) { 

    if (prevState.focusNode.dataShowType != this.state.focusNode.dataShowType || this.state.focusNode.metricIndex != prevState.focusNode.metricIndex) {
      this.state.global.texts.innerHTML = '';
      this.state.focusNode.metricIndex = 0;
      this.state.focusNode.id = 2;
      this.state.focusNode.x = 0;
      this.state.focusNode.y = 0;
      this.state.focusNode.hovorId = 2;
      this.state.global.messageDetails = document.getElementById("details");
      this.state.global.container = document.getElementById("viewContainer");
      this.state.global.textsRender = document.getElementById("renderContainer");
      this.state.global.viewStyle = window.getComputedStyle(
        this.state.global.container,
        null
      );
      this.state.global.width =
        parseInt(this.state.global.viewStyle.width) -
        2 * parseInt(this.state.global.viewStyle.paddingLeft) -
        2 * parseInt(this.state.global.viewStyle.marginLeft);
      let bgColor = this.state.global.viewStyle.backgroundColor.match(/\d+/g);
  
      function ColorToHex(color) {
        var hexadecimal = color.toString(16);
        return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
      }
  
      function ConvertRGBtoHex(red, green, blue) {
        return "0x" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
      }
  
  
  
  
  
  
  
      this.state.global.textsTop = -this.props.height;
      this.state.global.textsRender.style.top = this.state.global.textsTop + "px";
      this.state.global.textsRender.style.width = this.state.global.width + "px";
      this.state.global.textsRender.style.height = this.props.height + "px";
      this.state.global.texts = document.getElementById("renderTexts");
      this.state.global.app = new PIXI.Application({
        view: document.getElementById("renderView"),
        width: this.state.global.width,
        height: this.props.height,
        backgroundColor: ConvertRGBtoHex(
          parseInt(255),
          parseInt(255),
          parseInt(255)
        )
      });
      this.state.global.container.appendChild(this.state.global.app.view);
  
            window.Module._setUpDrawFlameGraph(-1, window.Module.addFunction(this.drawRectNode, 'viiiiiji'));
            window.onresize = this.onWindowResize;
            // let jsonStr = window.Module.cwrap('getMetricDesJsonStr', 'string')();
            // console.log(jsonStr)
            // this.state.metricTypesArray= JSON.parse(jsonStr);
          //  this.state.global.messageDetails.innerHTML = window.Module.cwrap('getContextDetails', 'string', ['number'])(id);
          console.log("1")
           this.drawFlameGraph(this.state.focusNode.dataShowType, this.state.focusNode.metricIndex, this.state.focusNode.filterName);
    }
    
    
  } 
   drawFlameGraph(dataShowType, metricIndex, functionFilter) {
    if (this.state.focusNode.dataShowType != dataShowType || this.state.focusNode.metricIndex != metricIndex
    ) {
      this.state.focusNode.dataShowType = dataShowType;
      this.state.focusNode.metricIndex = metricIndex;
      this.state.focusNode.id = 2;
      this.state.focusNode.x = 0;
      this.state.focusNode.y = 0;
      this.state.focusNode.hovorId = 2;
    }
  
    window.Module.ccall("setFunctionFilter", null, ["string"], [functionFilter]);
  
    window.Module._updateValueTree(0, dataShowType, metricIndex);
  
    this.onDraw();
  }
  onDraw (){
    this.state.global.texts.innerHTML = "";
    this.state.global.app.stage.removeChildren();
    this.state.global.app.renderer.resize(
      this.state.global.width,
      this.props.height
    );

    window.Module._drawFlameGraphClickNode(
      this.state.focusNode.id,
      this.state.focusNode.x,
      this.state.focusNode.y,
      this.state.global.width,
      20
    );
  }
  onWindowResize=()=> {
    this.update()
    this.onDraw()
  }
   drawTagHtml(x, y, w, h, id, c){
     
    var label = document.createElement("div");
    label.setAttribute("class", "flamegraph-tag");
    label.innerHTML = window.Module.cwrap("getContextName", "string", ["number"])(id);
    label.style.width = w + "px";
    label.style.height = h + "px";
    label.style.top = y + "px";
    label.style.left = x + "px";
    this.state.global.texts.append(label);
  }

   drawRectNode=(x, y, w, h, id, c, exsit)=>{
      let color = Number(c);
      let outline = new PIXI.Graphics();
      outline.beginFill(0xefefef);
      outline.drawRect(x, y, w, h);
      outline.interactive = true;
      outline.hitArea = new PIXI.Rectangle(x, y, w, h);
      outline.tint = 0xffffff;
  
      // outline.mouseover (mouseData){
      //   this.setState({
      //     tint: 0x9f78d9
      //   });
  
      //   this.state.global.messageDetails.innerHTML = window.Module.cwrap('getContextDetails', 'string', ['number'])(id);
      // };
      outline.mouseover = function (mouseData) {
        this.tint = 0x9F78D9;
        window.postMessage(
            {
                type: "changeMessageDetails",
                data: {
                    id: id
                }
            }
        );
    }
  
      // outline.mouseout = (mouseData)=>{
      //   this.setState({
      //     tint: 0xffffff
      //   });
      // };
      outline.mouseout = function (mouseData) {
        this.tint = 0xFFFFFF;
    }
  
      outline.click = function(ev){
        console.log("click")
        window.postMessage({
          type: "drawClickNode",
          data: {
            id: id,
            x: 0,
            y: y,
            h: h
          }
        });
  
      };
  
     this.state.global.app.stage.addChild(outline);
  
      if (w > 2) {
        let node = new PIXI.Graphics();
        node.beginFill(color, exsit ? 0.9 : 0.9);
        node.drawRect(x + 1, y + 1, w - 2, h - 2);
       this.state.global.app.stage.addChild(node);
      }
  
      if (w > 20) {
        this.drawTagHtml(x + 1, y + 1, w - 10, h - 2, id, c);
      }
    }
  update(){
    this.state.global.viewStyle = window.getComputedStyle(
      this.state.global.container,
      null
    );
    this.state.global.width =
      parseInt(this.state.global.viewStyle.width) -
      2 * parseInt(this.state.global.viewStyle.paddingLeft) -
      2 * parseInt(this.state.global.viewStyle.marginLeft);
    this.state.global.textsTop = -this.props.height;
    this.state.global.textsRender.style.top = this.state.global.textsTop + "px";
    this.state.global.textsRender.style.width = this.state.global.width + "px";
    this.state.global.textsRender.style.height = this.props.height + "px";
  }
  changeToTopDown=()=>{
    //this.state.focusNode.dataShowType = 1;
    //this.drawFlameGraph(0,  this.state.focusNode.metricIndex, "")
    this.setState({focusNode:{dataShowType : 0}})
  }
  changeToBottomUp=()=>{
    //this.state.focusNode.dataShowType = 1;
 
    this.setState({focusNode:{dataShowType : 1}})
   // console.log(this.state.focusNode.dataShowType)
   //  window.onresize = this.onWindowResize;
    //this.drawFlameGraph(this.state.focusNode.dataShowType,  this.state.focusNode.metricIndex, "")
  }

  changeToFlat=()=>{
    //this.state.focusNode.dataShowType = 1;
   // this.drawFlameGraph(2,  this.state.focusNode.metricIndex, "")
   this.setState({focusNode:{dataShowType : 2}})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({A: nextProps.isShow});
}

handleChangeMetricIndex=(event)=>{
 // console.log(event)
  //console.log(event.target.options.selectedIndex)
  this.setState({focusNode:{metricIndex:event.target.options.selectedIndex}})
}

// handleSubmit = (event) => {

//   console.log(this.state.filterValue)
//   event.preventDefault();
// }

// handleChange=(event)=> {
//   console.log(event.target.value)
//   this.setState({filterValue: event.target.value});
// }
handleChange(event) {
  console.log(event.target.value)
  this.setState({value: event.target.value});
}

handleSubmit(event) {
  this.setState({focusNode:{filterName:XEUtils.toValueString(this.state.value).trim()}})
//  XEUtils.toValueString(this.state.value).trim();
  event.preventDefault();
}



  render() {
    return (
      <div>
      <form className="w-full flex lg:ml-0" onSubmit={this.handleSubmit}>
        {/* <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label> */}
            <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                        <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <input type="text"    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                    value={this.state.value}  onChange={this.handleChange}  placeholder="Search"
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
      {/* <button
        type="button"
        onClick ={this.goFull}
        className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        FullScreen
      </button> */}
    </span>
    <div>
      {/* <label htmlFor="location" className="block text-sm font-medium text-gray-700">
        Location
      </label> */}
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
        <div id="viewContainer" className="col-start-2 col-span-4">
          <canvas id="renderView"></canvas>
        </div>
        <div className="col-start-2 col-span-4">
          <div style={{position: "relative", height: 0}}>
            <div id="renderContainer" style={{position: "absolute", pointerEvents: "none"}}>
              <div  id="renderTexts" style={{position: "relative", height: 0, width: 0}}>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
