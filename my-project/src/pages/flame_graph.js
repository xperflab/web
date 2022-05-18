import React, { Component } from "react";
import PropTypes from "prop-types";
import XEUtils from "xe-utils";
import * as PIXI from "pixi.js";
import '../pages-css/flame_graph.css';
function str2ab(str) {
    var buf = new ArrayBuffer(str.length); 
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export default class FlameGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessLoading: true,
      global: {},
      focusNode: {}
    };
    window.Module['onRuntimeInitialized'] = () =>{
      console.log("Runtime ready")
    }
  }

  static propTypes = {
    height: PropTypes.number
  };
  static defaultProps = {
    height: 1500
  };

  componentDidMount() {

   
    this.state.focusNode.dataShowType = 0;
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
    function decodeProfile(buffer, mime) {
      let data = new Uint8Array(buffer);
      let len = data.length;
      if(mime == "application/gzip") {
        // data = pako.ungzip(data);
        // len = data.length;
        // let newBuf = window.Module._malloc(data.length);
        // Module.HEAPU8.set(data, newBuf);
        // let result = window.Module._decode(newBuf, len);
        // return result;
      } else {
        let newBuf = window.Module._malloc(data.length);
        window.Module.HEAPU8.set(data, newBuf);
        let result = window.Module._decode(newBuf, len);
        if (result == 1) {
          try {
            // data = pako.ungzip(data);
            // len = data.length;
            // newBuf = window.Module._malloc(data.length);
            // Module.HEAPU8.set(data, newBuf);
            result = window.Module._decode(newBuf, len);
          } catch (error) {
            return 1;
          }
        }
        return result;
      }
    }

  var drawTagHtml=(x, y, w, h, id, c)=>{
    var label = document.createElement("div");
    label.setAttribute("class", "flamegraph-tag");
    label.innerHTML = window.Module.cwrap("getContextName", "string", ["number"])(id);
    label.style.width = w + "px";
    label.style.height = h + "px";
    label.style.top = y + "px";
    label.style.left = x + "px";
    this.state.global.texts.append(label);
  }
  var onDraw =()=>{
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
  var update=()=>{
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
  var drawRectNode=(x, y, w, h, id, c, exsit)=>{
    let color = Number(c);
    let outline = new PIXI.Graphics();
    outline.beginFill(0xefefef);
    outline.drawRect(x, y, w, h);
    outline.interactive = true;
    outline.hitArea = new PIXI.Rectangle(x, y, w, h);
    outline.tint = 0xffffff;

    outline.mouseover = (mouseData)=>{
      this.setState({
        tint: 0x9f78d9
      });
      window.postMessage({
        type: "changeMessageDetails",
        data: {
          id: id
        }
      });
    };

    outline.mouseout = (mouseData)=>{
      this.setState({
        tint: 0xffffff
      });
    };

    outline.click = (ev)=>{
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
      drawTagHtml(x + 1, y + 1, w - 10, h - 2, id, c);
    }
  }
  function onWindowResize() {
    update();
    onDraw();
  }

  var drawFlameGraph=(dataShowType, metricIndex, functionFilter) =>{
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

    onDraw();
  }

    this.state.global.textsTop = -this.props.height;
    this.state.global.textsRender.style.top = this.state.global.textsTop + "px";
    this.state.global.textsRender.style.width = this.state.global.width + "px";
    this.state.global.textsRender.style.height = this.props.height + "px";
    this.state.global.texts = document.getElementById("renderTexts");
    this.state.global.app = new PIXI.Application({
      view: document.getElementById("renderView"),
      width: this.state.global.width,
      height: this.props.height
      // backgroundColor: ConvertRGBtoHex(
      //   parseInt(256),
      //   parseInt(256),
      //   parseInt(256)
      // )
    });
    this.state.global.container.appendChild(this.state.global.app.view);
    const data = localStorage.getItem('data')
    const binaryStr = str2ab(data)
    console.log(binaryStr)
    let result = decodeProfile(binaryStr, '2')
    console.log(result)
        if (result == 0) {
          let jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')()
          console.log(jsonStr)
          let fileExistList = JSON.parse(jsonStr)
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
          window.Module._setUpDrawFlameGraph(-1, window.Module.addFunction(drawRectNode, 'viiiiiji'));
          window.onresize = onWindowResize;
          drawFlameGraph(0, 0, "");
        }
  }









  render() {
    return (
      <div className="grid grid-cols-6 gap-x-1">
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
    );
  }
}
