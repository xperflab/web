/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
import {
  SearchIcon,
} from '@heroicons/react/solid';
import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import {Component} from 'react';
import XEUtils from 'xe-utils';
import {inject, observer} from 'mobx-react';
import '../views-css/flamegraph.css';
import {Fragment} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon, Cog} from '@heroicons/react/solid';
import {toJS} from 'mobx';
import {CogIcon} from '@heroicons/react/outline';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
class FlameGraph extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    let bgColor = 0;
    if (props.ViewStore.theme === 'dark') {
      bgColor = 0;
    } else {
      bgColor = 255;
    }
    this.state = {
      isFull: false,
      isShow: false,
      isProcessLoading: true,
      global: {},
      metricTypesArray: [],
      focusNode: {
      },
      dataShowType: props.FlameGraphStore.dataShowType,
      metricIndex: props.FlameGraphStore.metricIndex,
      filterName: this.props.filterName,
      value: '',
      backgroundColor: bgColor,
      selected: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.viewContainer = React.createRef();
    this.renderview = React.createRef();
  }

  static propTypes = {
    height: PropTypes.number,
  };
  static defaultProps = {
    height: 1500,
  };
  componentDidMount() {
    console.log(this.props);

    this.state.focusNode.id = 2;
    this.state.focusNode.x = 0;
    this.state.focusNode.y = 0;
    this.state.focusNode.hovorId = 2;
    this.state.global.messageDetails = document.getElementById('details');
    this.state.global.container = document.getElementById('viewContainer');
    console.log(this.state.global.container);
    this.state.global.renderview = document.getElementById('renderView');
    this.state.global.textsRender = document.getElementById('renderContainer');
    this.state.global.viewStyle = window.getComputedStyle(
        this.state.global.container,
        null,
    );
    this.state.global.width =
        parseInt(this.state.global.viewStyle.width) -
        2 * parseInt(this.state.global.viewStyle.paddingLeft) -
        2 * parseInt(this.state.global.viewStyle.marginLeft);
    const bgColor = this.state.global.viewStyle.backgroundColor.match(/\d+/g);

    function ColorToHex(color) {
      const hexadecimal = color.toString(16);
      return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
    }

    function ConvertRGBtoHex(red, green, blue) {
      return '0x' + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
    }


    this.state.global.textsTop = -this.props.height;
    this.state.global.textsRender.style.top = this.state.global.textsTop + 'px';
    this.state.global.textsRender.style.width = this.state.global.width + 'px';
    this.state.global.textsRender.style.height = this.props.height + 'px';
    this.state.global.texts = document.getElementById('renderTexts');
    this.state.global.app = new PIXI.Application({
      view: document.getElementById('renderView'),
      width: this.state.global.width,
      height: this.props.height,
      backgroundColor: ConvertRGBtoHex(
          parseInt(this.state.backgroundColor),
          parseInt(this.state.backgroundColor),
          parseInt(this.state.backgroundColor),
      ),
    });
    this.state.global.container.appendChild(this.state.global.app.view);

    window.Module._setUpDrawFlameGraph(-1, window.Module.addFunction(this.drawRectNode, 'viiiiiji'));
    window.onresize = this.onWindowResize;
    const jsonStr = window.Module.cwrap('getMetricDesJsonStr', 'string')();
    console.log(jsonStr);
    // this.state.metricTypesArray = JSON.parse(jsonStr);
    const metricJson = JSON.parse(jsonStr);
    console.log(metricJson);
    this.setState({selected: metricJson[0]});
    this.setState({metricTypesArray: metricJson});
    window.postMessage(
        {
          type: 'init MetricTypesArray',
          data: metricJson,
        },
    );
    this.drawFlameGraph(this.state.dataShowType, this.state.metricIndex, this.state.filterName);

    this.resizeObserver = new ResizeObserver((entries) => {
      console.log('resize');
      this.state.global.renderview.width= this.viewContainer.current.offsetWidth;
      this.update();
      this.onDraw();
    });
    this.resizeObserver.observe(document.getElementById('viewContainer'));

    window.addEventListener('message', (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        case 'drawClickNode': {
          console.log(this);
          this.state.global.texts.innerHTML = '';
          this.state.global.app.stage.removeChildren();
          this.state.focusNode.id = message.data.id;
          this.state.focusNode.x = message.data.x;
          this.state.focusNode.y = message.data.y;
          console.log(message.data.x);
          //   console.log(this.state.global.width)
          //    console.log("2")
          const drawClickNodes = XEUtils.debounce(window.Module._drawFlameGraphClickNode(message.data.id, message.data.x, message.data.y, this.state.global.width, message.data.h), 200);
          const clickNodeMessageStr = window.Module.cwrap('getClickNodeMessage', 'string', ['number', 'number', 'number'])(this.state.focusNode.id, 0, this.state.metricIndex);
          const obj = JSON.parse(clickNodeMessageStr);
          break;
        }
        case 'changeMessageDetails': {
          // console.log(message.type);
          this.state.focusNode.hovorId = message.data.id;
          this.state.global.messageDetails.innerHTML = Module.cwrap('getContextDetails', 'string', ['number'])(this.state.focusNode.hovorId);
          break;
        }
      }
    },
    );
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps);
    console.log(this.state);

    if (prevState.dataShowType != this.state.dataShowType) {
      this.drawFlameGraph(this.state.dataShowType, prevState.metricIndex, prevProps.filterName);
    }

    if (this.state.metricIndex != prevState.metricIndex) {
      this.drawFlameGraph(prevState.dataShowType, this.state.metricIndex, prevProps.filterName);
    }

    if (prevProps.filterName != this.props.filterName) {
      this.drawFlameGraph(prevState.dataShowType, prevState.metricIndex, this.props.filterName);
    }
  }
  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }
  drawFlameGraph(dataShowType, metricIndex, functionFilter) {
    if (this.state.dataShowType != dataShowType || this.state.metricIndex != metricIndex
    ) {
      this.state.dataShowType = dataShowType;
      this.props.FlameGraphStore.setDataShowType(dataShowType);
      this.state.metricIndex = metricIndex;
      this.props.FlameGraphStore.setMetricIndex(metricIndex);
      this.state.focusNode.id = 2;
      this.state.focusNode.x = 0;
      this.state.focusNode.y = 0;
      this.state.focusNode.hovorId = 2;
    }

    window.Module.ccall('setFunctionFilter', null, ['string'], [functionFilter]);

    window.Module._updateValueTree(0, dataShowType, metricIndex);

    this.onDraw();
  }
  onDraw() {
    this.state.global.texts.innerHTML = '';
    this.state.global.app.stage.removeChildren();
    this.state.global.app.renderer.resize(
        this.state.global.width,
        this.props.height,
    );

    window.Module._drawFlameGraphClickNode(
        this.state.focusNode.id,
        this.state.focusNode.x,
        this.state.focusNode.y,
        this.state.global.width,
        20,
    );
  }
  onWindowResize = () => {
    this.update();
    this.onDraw();
  };
  drawTagHtml(x, y, w, h, id, c) {
    const label = document.createElement('div');
    label.setAttribute('class', 'flamegraph-tag');
    label.innerHTML = window.Module.cwrap('getContextName', 'string', ['number'])(id);
    label.style.width = w + 'px';
    label.style.height = h + 'px';
    label.style.top = y + 'px';
    label.style.left = x + 'px';
    this.state.global.texts.append(label);
  }

  drawRectNode = (x, y, w, h, id, c, exsit) => {
    const color = Number(c);
    const outline = new PIXI.Graphics();
    outline.beginFill(0xefefef);
    outline.drawRect(x, y, w, h);
    outline.interactive = true;
    outline.hitArea = new PIXI.Rectangle(x, y, w, h);
    outline.tint = 0xffffff;
    outline.mouseover = function(mouseData) {
      this.tint = 0x9F78D9;
      window.postMessage(
          {
            type: 'changeMessageDetails',
            data: {
              id: id,
            },
          },
      );
    };
    outline.mouseout = function(mouseData) {
      this.tint = 0xFFFFFF;
    };
    outline.on('touchend', function(e) {
      console.log('touch');
      window.postMessage({
        type: 'drawClickNode',
        data: {
          id: id,
          x: 0,
          y: y,
          h: h,
        },
      });
    });

    outline.click = XEUtils.debounce(function(ev) {
      console.log('click');
      window.postMessage({
        type: 'drawClickNode',
        data: {
          id: id,
          x: 0,
          y: y,
          h: h,
        },
      });
    }, 200)

    ;

    this.state.global.app.stage.addChild(outline);

    if (w > 2) {
      const node = new PIXI.Graphics();
      node.beginFill(color, exsit ? 0.9 : 0.9);
      node.drawRect(x + 1, y + 1, w - 2, h - 2);
      this.state.global.app.stage.addChild(node);
    }

    if (w > 20) {
      this.drawTagHtml(x + 1, y + 1, w - 10, h - 2, id, c);
    }
  };
  update() {
    this.state.global.viewStyle = window.getComputedStyle(
        this.state.global.container,
        null,
    );
    this.state.global.width =
        parseInt(this.state.global.viewStyle.width) -
        2 * parseInt(this.state.global.viewStyle.paddingLeft) -
        2 * parseInt(this.state.global.viewStyle.marginLeft);
    this.state.global.textsTop = -this.props.height;
    this.state.global.textsRender.style.top = this.state.global.textsTop + 'px';
    this.state.global.textsRender.style.width = this.state.global.width + 'px';
    this.state.global.textsRender.style.height = this.props.height + 'px';
  }
  changeToTopDown = () => {
    // this.state.dataShowType = 1;
    // this.drawFlameGraph(0,  this.state.metricIndex, "")
    this.state.focusNode.id = 2;
    this.state.focusNode.x = 0;
    this.state.focusNode.y = 0;
    this.state.focusNode.hovorId = 2;
    this.setState({dataShowType: 0});
    this.props.FlameGraphStore.setDataShowType(0);
  };


  changeToBottomUp = () => {
    // this.state.dataShowType = 1;
    console.log(this);
    this.state.focusNode.id = 2;
    this.state.focusNode.x = 0;
    this.state.focusNode.y = 0;
    this.state.focusNode.hovorId = 2;
    this.setState({dataShowType: 1});
    this.props.FlameGraphStore.setDataShowType(1);
    // console.log(this.state.dataShowType)
    //  window.onresize = this.onWindowResize;
    // this.drawFlameGraph(this.state.dataShowType,  this.state.metricIndex, "")
  };

  changeToFlat = () => {
    // this.state.dataShowType = 1;
    // this.drawFlameGraph(2,  this.state.metricIndex, "")
    this.state.focusNode.id = 2;
    this.state.focusNode.x = 0;
    this.state.focusNode.y = 0;
    this.state.focusNode.hovorId = 2;
    this.setState({dataShowType: 2});
    this.props.FlameGraphStore.setDataShowType(2);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({A: nextProps.isShow});
  }

  handleChangeMetricIndex = (event) => {
    console.log(event);
    this.setState({metricIndex: event.id});
    this.props.FlameGraphStore.setMetricIndex(event.id);
    this.setState({selected: event});
  };

  handleChange(event) {
    console.log(event.target.value);
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setState({filterName: XEUtils.toValueString(this.state.value).trim()});
    event.preventDefault();
  }


  render() {
    return (
      <div className='ml-1 mr-1 mt-1'>
        <span className="relative z-0 inline-flex shadow-sm rounded-md">
          <div className="flex
        h-8" role="group">
            <button
              onClick={this.changeToTopDown}
              type="button"
              className="
        rounded-l
        px-6
        py-2
        border-2 border-blue-600
        text-blue-600
        font-medium
        text-xs
        leading-tight
        uppercase
        hover:bg-black hover:bg-opacity-5
        focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out

      "
            >
      Top Down
            </button>
            <button
              onClick={this.changeToBottomUp}
              type="button"
              className="
        px-6
        py-2
        border-t-2 border-b-2 border-blue-600
        text-blue-600
        font-medium
        text-xs
        leading-tight
        uppercase
        hover:bg-black hover:bg-opacity-5
        focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out
      "
            >
      Bottom Up
            </button>
            <button
              onClick={this.changeToFlat}
              type="button"
              className="
        rounded-r
        px-6
        py-2
        border-2 border-blue-600
        text-blue-600
        font-medium
        text-xs
        leading-tight
        uppercase
        hover:bg-black hover:bg-opacity-5
        focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out
        w-28
      "
            >
      Flat
            </button>
          </div>
          {/* <button
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
          </button> */}
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

          <Listbox value={this.state.selected} onChange={this.handleChangeMetricIndex}>
            {({open}) => (
              <>
                <div className="mt-1 relative">
                  <Listbox.Button className="relative dark:bg-slate-600 dark:border-slate-600 w-[0.03rem] h-[1.9rem] bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default sm:text-sm">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <CogIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options static className="absolute z-10 mt-1 w-[25rem] dark:bg-slate-600
                  bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {this.state.metricTypesArray.map((metricType) => (
                        <Listbox.Option
                          key={metricType.id}
                          className={({active}) =>
                            classNames(
                          active ? 'text-white bg-indigo-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9 dark:text-slate-200',
                            )
                          }
                          value={metricType}
                        >
                          {({selected, active}) => (
                            <>
                              <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                {metricType.name}
                              </span>

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

          {/* <Select options={this.state.focusNode.metricTypesArray[0].name} /> */}

        </div>
        {/* <div className="grid grid-cols-6 gap-x-1 "> */}
        <div >
          <div className="col-start-2 col-span-4">
            <div id="details" className="details dark:text-slate-300">
                VIRTUAL ROOT
            </div>
          </div>
          <div className="col-start-2 col-span-4">
            <div className="details"></div>
          </div>
          <div id="viewContainer" ref={this.viewContainer} className="col-start-2 col-span-4"style={{height: 1500}} >
            <canvas id="renderView" ref ={this.renderview} className="canvas">
            </canvas>
          </div>
          <div className="col-start-2 col-span-4">
            <div style={{position: 'relative', height: 0}}>
              <div id="renderContainer" style={{position: 'absolute', pointerEvents: 'none'}}>
                <div id="renderTexts" style={{position: 'relative', height: 0, width: 0}}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default inject('ViewStore', 'ProfileStore', 'FlameGraphStore')(observer(FlameGraph));
