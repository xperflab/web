import React, { Component } from "react";
import PropTypes from "prop-types";
import XEUtils from "xe-utils";
import * as PIXI from "pixi.js";
function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 每个字符占用2个字节
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

    this.state.global.textsTop = -this.props.height - 4;
    this.state.global.textsRender.style.top = this.state.global.textsTop + "px";
    this.state.global.textsRender.style.width = this.state.global.width + "px";
    this.state.global.textsRender.style.height = this.props.height + "px";
    this.state.global.texts = document.getElementById("renderTexts");
    this.state.global.app = new PIXI.Application({
      view: document.getElementById("renderView"),
      width: this.state.global.width,
      height: this.props.height,
      backgroundColor: ConvertRGBtoHex(
        parseInt(bgColor[0]),
        parseInt(bgColor[1]),
        parseInt(bgColor[2])
      )
    });
    this.state.global.container.appendChild(this.state.global.app.view);

  }
  onDraw() {
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

  update() {
    this.state.global.viewStyle = window.getComputedStyle(
      this.state.global.container,
      null
    );
    this.state.global.width =
      parseInt(this.state.global.viewStyle.width) -
      2 * parseInt(this.state.global.viewStyle.paddingLeft) -
      2 * parseInt(this.state.global.viewStyle.marginLeft);
    this.state.global.textsTop = -this.props.height - 4;
    this.state.global.textsRender.style.top = this.state.global.textsTop + "px";
    this.state.global.textsRender.style.width = this.state.global.width + "px";
    this.state.global.textsRender.style.height = this.props.height + "px";
  }

  drawTagHtml(x, y, w, h, id, c) {
    var label = document.createElement("div");
    label.setAttribute("class", "flamegraph-tag");
    label.innerHTML = window.Module.cwrap("getContextName", "string", ["number"])(id);
    label.style.width = w + "px";
    label.style.height = h + "px";
    label.style.top = y + "px";
    label.style.left = x + "px";
    this.state.global.texts.append(label);
  }

  drawRectNode(x, y, w, h, id, c, exsit) {
    let color = Number(c);
    let outline = new PIXI.Graphics();
    outline.beginFill(0xefefef);
    outline.drawRect(x, y, w, h);
    outline.interactive = true;
    outline.hitArea = new PIXI.Rectangle(x, y, w, h);
    outline.tint = 0xffffff;

    outline.mouseover = function(mouseData) {
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

    outline.mouseout = function(mouseData) {
      this.setState({
        tint: 0xffffff
      });
    };

    outline.click = function(ev) {
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
      node.beginFill(color, exsit ? 0.9 : 0.4);
      node.drawRect(x + 1, y + 1, w - 2, h - 2);
      this.state.global.app.stage.addChild(node);
    }

    if (w > 20) {
      this.drawTagHtml(x + 1, y + 1, w - 10, h - 2, id, c);
    }
  }

  onWindowResize() {
    this.update();
    this.onDraw();
  }

  drawFlameGraph(dataShowType, metricIndex, functionFilter) {
    if (
      this.state.focusNode.dataShowType != dataShowType ||
      this.state.focusNode.metricIndex != metricIndex
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

  render() {
    return (
      <div >
        <div >
          <div id="details" className="details">
            VIRTUAL ROOT
          </div>
        </div>
        <div >
          <div className="details"></div>
        </div>
        <div id="viewContainer" >
          <canvas id="renderView"></canvas>
        </div>
        <div>
          <div>
            <div id="renderContainer">
              <div id="renderTexts"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
