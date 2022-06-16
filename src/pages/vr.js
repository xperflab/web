import 'aframe';
import { Entity, Scene } from "../compoents/aframe-react";
import 'babel-polyfill';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { flamegraph } from 'd3-flame-graph';
import * as d3 from 'd3';

import '../compoents/orthoAframeComponent';

const colorHue = 'warm'

function generateHash(name) {
  // Return a vector (0.0->1.0) that is a hash of the input string.
  // The hash is computed to favor early characters over later ones, so
  // that strings with similar starts have similar vectors. Only the first
  // 6 characters are considered.
  const MAX_CHAR = 6

  let hash = 0
  let maxHash = 0
  let weight = 1
  const mod = 10

  if (name) {
    for (let i = 0; i < name.length; i++) {
      if (i > MAX_CHAR) { break }
      hash += weight * (name.charCodeAt(i) % mod)
      maxHash += weight * (mod - 1)
      weight *= 0.70
    }
    if (maxHash > 0) { hash = hash / maxHash }
  }
  return hash
}

function generateColorVector(name) {
  let vector = 0
  if (name) {
    const nameArr = name.split('`')
    if (nameArr.length > 1) {
      name = nameArr[nameArr.length - 1] // drop module name if present
    }
    name = name.split('(')[0] // drop extra info
    vector = generateHash(name)
  }
  return vector
}

function calculateColor(hue, vector) {
  let r
  let g
  let b

  if (hue === 'red') {
    r = 200 + Math.round(55 * vector)
    g = 50 + Math.round(80 * vector)
    b = g
  } else if (hue === 'orange') {
    r = 190 + Math.round(65 * vector)
    g = 90 + Math.round(65 * vector)
    b = 0
  } else if (hue === 'yellow') {
    r = 175 + Math.round(55 * vector)
    g = r
    b = 50 + Math.round(20 * vector)
  } else if (hue === 'green') {
    r = 50 + Math.round(60 * vector)
    g = 200 + Math.round(55 * vector)
    b = r
  } else if (hue === 'pastelgreen') {
    // rgb(163,195,72) - rgb(238,244,221)
    r = 163 + Math.round(75 * vector)
    g = 195 + Math.round(49 * vector)
    b = 72 + Math.round(149 * vector)
  } else if (hue === 'blue') {
    // rgb(91,156,221) - rgb(217,232,247)
    r = 91 + Math.round(126 * vector)
    g = 156 + Math.round(76 * vector)
    b = 221 + Math.round(26 * vector)
  } else if (hue === 'aqua') {
    r = 50 + Math.round(60 * vector)
    g = 165 + Math.round(55 * vector)
    b = g
  } else if (hue === 'cold') {
    r = 0 + Math.round(55 * (1 - vector))
    g = 0 + Math.round(230 * (1 - vector))
    b = 200 + Math.round(55 * vector)
  } else {
    // original warm palette
    r = 200 + Math.round(55 * vector)
    g = 0 + Math.round(230 * (1 - vector))
    b = 0 + Math.round(55 * (1 - vector))
  }

  return `#${r.toString(16).length > 1 ? r.toString(16) : '0' + r.toString(16)}${g.toString(16).length > 1 ? g.toString(16) : '0' + g.toString(16)}${b.toString(16).length > 1 ? b.toString(16) : '0' + b.toString(16)}`
}

function colorHash(name, libtype) {
  // Return a color for the given name and library type. The library type
  // selects the hue, and the name is hashed to a color in that hue.

  // default when libtype is not in use
  let hue = colorHue || 'warm'

  if (!colorHue && !(typeof libtype === 'undefined' || libtype === '')) {
    // Select hue. Order is important.
    hue = 'red'
    if (typeof name !== 'undefined' && name && name.match(/::/)) {
      hue = 'yellow'
    }
    if (libtype === 'kernel') {
      hue = 'orange'
    } else if (libtype === 'jit') {
      hue = 'green'
    } else if (libtype === 'inlined') {
      hue = 'aqua'
    }
  }

  const vector = generateColorVector(name)
  return calculateColor(hue, vector)
}

function handleData(trace, num_graph) {
  // trace should be a array and not null
  if (trace.length <= 0)
    return

  let traceStartTime = trace[0].start
  let traceEndTime = Math.max(...trace.map(e => e.start + e.dur))
  let maxStackDepth = Math.max(...trace.map(e => e.stack.length))

  const epoch_time = (traceEndTime - traceStartTime) / num_graph
  let root = []
  for (let index = 0; index < num_graph; index++) {
    root.push({ "name": "root", descendants: {}, level: 0, top: false })
  }

  for (const e of trace) {
    handleStack(root, e, traceStartTime, epoch_time)
  }

  return [root.map(v => Object.values(v.descendants)[0]), traceStartTime, traceEndTime, maxStackDepth]
}

function handleStack(root, e, start_time, epoch_time) {
  let index = Math.floor((e.start - start_time) / epoch_time)

  // while a stack trace cross multiple flame graphs,
  // each graph get its own effective percent of value
  while (start_time + epoch_time * index < e.start + e.dur) {
    let curr = root[index]
    const end_epoch = start_time + epoch_time * (index + 1)
    const effective_percent =
      (Math.min(e.start + e.dur, end_epoch) -
        Math.max(e.start, end_epoch - epoch_time)) / e.dur

    // handle name inside stack
    for (let index = e.stack.length - 1; index > 0; index--) {
      const name = e.stack[index].name;

      if (!curr.descendants[name]) {
        curr.descendants[name] = { name: name, value: 0, descendants: {}, level: curr.level + 1, top: false }
      }

      curr = curr.descendants[name]
      curr.value += e.value * effective_percent
    }

    // handle the top of stack function
    const name = e.name
    if (!curr.descendants[name]) {
      curr.descendants[name] = { name: name, value: 0, descendants: {}, level: curr.level + 1, top: true }
    }
    curr = curr.descendants[name]
    curr.value += e.value * effective_percent

    index++
  }
}

// max level = 20
function mapToD3Tree(root) {
  let res = {}
  res.name = root.name
  res.value = root.value
  if (!root.descendants || root.level > 20)
    return null
  let ch = Object.values(root.descendants).map(e => mapToD3Tree(e)).filter(x => !!x)
  if (ch.length) {
    res.children = ch
  }
  return res
}

class AFrameBox {
  constructor(x, y, z, w, h, d, c, text, opacity, top) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.d = d;
    this.h = h;
    this.w = w;
    this.c = c;
    this.text = text
    this.opacity = opacity
    this.top = top
  }
}

function drawABox(box, i) {
  return <Entity primitive='a-box'
    depth={box.d}
    height={box.h}
    width={box.w}
    color={box.c}
    position={{ x: box.x, y: box.y, z: box.z }}
    material={{ opacity: box.opacity }}
    key={i}
  >
    {
      box.w > box.text.length * 0.1 && <Entity primitive='a-text' value={box.text} position={
        { x: -box.w / 2, y: 0, z: box.d / 2 }
      }></Entity>
    }
  </Entity>
}

function drawAFrameGraph(boxes, index) {
  return (<Entity key={index}> {boxes.map((b, i) => drawABox(b, i))}</Entity>)
}

const default_depth = 0.2
const default_height = 0.2
const default_graph_gap = 0.1
const max_width = 10

// Suitable width with default viewpoint
function draw3DGraphs(root) {
  if (root.length == 0)
    return []

  const start_x = max_width / 2
  const start_y = default_height / 2
  const start_z = (root.length * default_depth + (root.length - 1) * default_graph_gap) / 2

  const bs = root.map(e => Object.values(e.descendants)[0].value)
  const width_list = bs.map(e => e / Math.max(...bs))

  let allBoxes = []
  for (let index = 0; index < root.length; index++) {
    const e = root[index];
    const width = max_width * width_list[index]

    let boxes = drawSubBox(e,
      start_x - width / 2, start_y, start_z - index * (default_depth + default_graph_gap),
      width)

    allBoxes.push(boxes)
  }

  return allBoxes
}

function drawSubBox(ele, x, y, z, width) {
  let boxes = [];
  const color = colorHash(ele.name)

  // draw translucent if level is too high..
  let opacity = 1
  if (ele.level > 10)
    opacity = (20 - ele.level) / 10
  if (ele.level > 20)
    return boxes

  boxes.push(new AFrameBox(x, y, z, width, default_height, default_depth, color, ele.name, opacity, ele.top))

  let now_x = x - width / 2
  const new_y = y + default_height // new stack level

  for (const k in ele.descendants) {
    let e = ele.descendants[k]

    const new_width = width * e.value / ele.value
    const new_x = now_x + new_width / 2
    now_x += new_width
    boxes = boxes.concat(drawSubBox(e, new_x, new_y, z, new_width)).sort((a, b) => a.y - b.y)
  }

  return boxes
}

function resizeCanvasToDisplaySize(canvas) {
  const { width, height } = canvas.getBoundingClientRect()

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true // here you can return some usefull information like delta width and delta height instead of just true
    // this information can be used in the next redraw...
  }

  return false
}

// from center and draw from center
function drawRect(ctx, x, y, l, w, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x - l, y - w, l * 2, w * 2);
}

function drawPreview(ctx, all) {
  // reset canvas
  ctx.canvas.height = ctx.canvas.height
  console.log(ctx.canvas.width, ctx.canvas.height)

  const new_height = ctx.canvas.offsetHeight
  const max_pixel = ctx.canvas.offsetWidth / 2

  const all_data = all.flat().filter(d => d.top).sort((a, b) => a.y - b.y)
  for (const d of all_data) {
    drawRect(ctx,
      max_pixel - d.z / max_width * max_pixel,
      d.x / max_width * new_height + new_height / 2,
      default_depth / 2 * max_pixel / max_width,
      d.w / 2 * new_height / max_width,
      d.c)
  }
}

const Preview = props => {
  const canvasRef = useRef(null)
  const [scale, setScale] = useState({ x: 0, y: 0 })

  const all = draw3DGraphs(props.data);

  // Set up resize handler once 
  useEffect(() => {
    const canvas = canvasRef.current
    const actualResizeHandler = () => {
      setScale({ x: canvas.clientWidth, y: canvas.clientHeight })
    }

    let resizeTimeout;
    const handleResize = e => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;
          actualResizeHandler();
          // The actualResizeHandler will execute at a rate of 15fps
        }, 66);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // when prop update 
  useEffect(() => {
    const canvas = canvasRef.current
    resizeCanvasToDisplaySize(canvas)
    if (!props.data)
      return

    const ctx = canvas.getContext('2d')
    drawPreview(ctx, all)
  }, [scale, props.data])

  return <canvas ref={canvasRef} {...props} />
}

const D3 = props => {
  const d3Ref = useRef(null)
  const [scale, setScale] = useState({ x: 0, y: 0 })

  // Set up resize handler once 
  useEffect(() => {
    const ref = d3Ref.current
    const actualResizeHandler = () => {
      setScale({ x: ref.clientWidth, y: ref.clientHeight });
    }

    let resizeTimeout;
    const handleResize = e => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;
          actualResizeHandler();
          // The actualResizeHandler will execute at a rate of 15fps
        }, 66);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const ct = d3Ref.current
    const chart = flamegraph()
      .width(ct.offsetWidth)
      .height(ct.offsetHeight)
      .inverted(true)

    if (!props.data)
      return

    const m = mapToD3Tree(props.data)
    d3.select(ct)
      .datum(m)
      .call(chart);
  }, [props.data, scale])

  return <span className="h-full" ref={d3Ref} />
}

const VR = props => {
  const rootRef = useRef(null)

  // Load data
  const [data, setData] = useState(null);
  const onFile = e => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = e => {
      const text = (e.target.result)
      const data = JSON.parse(text)

      setData(data)
    };
    reader.readAsText(e.target.files[0])
  }
  const useFetchFile = filepath => {
    fetch(filepath).then(
      r => r.json()
    ).then(
      d => setData(d)
    )
  }

  // Handle slice number
  const initN = 50
  const [n, setN] = useState(initN);
  const decreaseFg = () => { if (n > 0) { setN(i => i - 1); setUpdateCounter(!updateCounter) } }
  const increaseFg = () => { setN(i => i + 1); setUpdateCounter(!updateCounter) }

  // Handle file, build 3D
  const [stat, setStat] = useState({
    start: 0,
    end: 0,
    epoch: 0,
    maxStackDepth: 0
  });

  const [updateCounter, setUpdateCounter] = useState(true);
  let rootmap = useMemo(
    () => {
      if (!data) return []
      else {
        const [d, traceStartTime, traceEndTime, maxStackDepth] = handleData(data, n)
        setStat({
          start: traceStartTime,
          end: traceEndTime,
          epoch: (traceEndTime - traceStartTime) / n,
          maxStackDepth: maxStackDepth
        })
        return d
      }
    }, [n, data])

  // Handle selected event
  const [selected, setSelected] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fgs = rootRef.current.children
    if (fgs.length == 0)
      return

    for (let i = 0; i < fgs.length; i++) {
      if (show && i < selected) fgs[i].setAttribute('mixin', 'moveFar')
      else fgs[i].setAttribute('mixin', 'moveBack')
    }
  }, [selected, show])
  const onShowSelected = e => { setShow(e.target.checked) }
  const onSelectRangeChange = e => { setSelected(e.target.value) }

  // Handle pos event
  const posDefault = n => Math.floor(n / 2)
  const [pos, setPos] = useState(posDefault(n));
  useEffect(() => {
    rootRef.current.setAttribute('animation', `property: position; to: 0 0 ${(Math.floor(n / 2) - pos) * 0.5}`)
  }, [pos])
  const onPosRangeChange = e => { setPos(e.target.value) }

  // Handle zoom
  const initScale = 0.3
  const [scale, setScale] = useState(initScale);
  useEffect(() => {
    rootRef.current.setAttribute('animation__2', `property: scale; to: ${scale} ${scale} ${scale}`)
  }, [scale])
  const zoomIn = () => { if (n > 0) setScale(i => i - 0.05) }
  const zoomOut = () => { setScale(i => i + 0.05) }

  // Handle viewpoint switch
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    rootRef.current.parentNode.emit(vertical ? 'vertical' : 'original')
  }, [vertical])
  const originalView = () => { setVertical(false) }
  const verticalView = () => { setVertical(true) }

  // Handle reset
  const onReset = () => {
    setSelected(0)
    setShow(false)
    setN(initN)
    setPos(posDefault(initN))
    setScale(initScale)
    setVertical(false)
    setUpdateCounter(!updateCounter)
  }

  const useTrace = () => { useFetchFile('trace.json'); onReset() }
  const useTraceGcc = () => { useFetchFile('trace_gcc.json'); onReset() }

  return (
    <div className="container-xl m-0 w-full h-screen px-2 py-2">
      <div className="flex flex-col h-full">
        <div className="flex flex-row">
          <input className="form-controlblock
        basis-1/3
        w-full
        px-2
        py-1
        text-sm
        font-normal
        text-white
        bg-clip-padding
        transition
        ease-in-out
        bg-[#111827]
        m-0
        focus:text-white focus:bg-[#B73C93] focus:border-blue-600 focus:outline-none"
            type="file" style={{ width: '220px', display: 'inline' }} id="fileinput" />
          <button className="basis-1/3 justify-center inline-flex items-center px-2.5 py-1.5 border-transparent text-xs font-medium text-white bg-[#111827] hover:bg-[#B73C93] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:bg-[#B73C93]"
            onClick={useTraceGcc}>Use trace_gcc.json</button>
          <button className="basis-1/3 justify-center inline-flex items-center px-2.5 py-1.5  border-transparent text-xs font-medium text-white bg-[#111827] hover:bg-[#B73C93] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:bg-[#B73C93]"
            onClick={useTrace}>Use trace.json</button>
        </div>
        <div className="flex flex-col grow">
          <div className="flex flex-row mt-2 bg-[#F6F8FA] overflow-hidden shadow rounded-lg basis-1/6">
            <button type="button" className="-ml-px relative inline-flex items-center px-4 py-2 bg-[#959DA6] text-sm font-medium text-white hover:bg-[#B73C93] focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-[#B73C93]"
              onClick={decreaseFg}>-</button>
            <span className="flex grow inline w-full h-full">
              <Preview className="w-full h-full" data={rootmap} />
            </span>
            <button type="button" className="relative inline-flex items-center px-4 py-2 bg-[#959DA6] text-sm font-medium text-white hover:bg-[#B73C93] focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-[#B73C93]"
              onClick={increaseFg}>+</button>
          </div>
          <div className="flex flex-row pt-2 basis-5/6">
            <div className="basis-3/5 mr-2 bg-white overflow-hidden shadow rounded-lg">
              {
                rootmap.length != 0 &&

                <div id="control" className="relative float-left z-10 top-5 bg-[#111827] opacity-80 text-neutral-100 text-xs ml-2 p-1">
                  <span>
                    <input type="checkbox" checked={show} name="show" onChange={onShowSelected} />
                    <label htmlFor="show">Show Selected Flamegraph</label>
                  </span>
                  <div>
                    <input type="range" name="fginput" min={0} max={n} value={selected} onChange={onSelectRangeChange} />
                    <span>Flamegraph: </span>
                    <span className="font-bold">{selected}</span>
                  </div>
                  <div className="flex">
                    <button type="button" className="p-[1px] m-[1px] border-[1px] disabled:border-transparent text-white hover:bg-black enabled:active:border-black basis-1/2"
                      onClick={originalView} disabled={vertical ? "" : true}>Original view</button>
                    <button type="button" className="p-[1px] m-[1px] border-[1px] disabled:border-transparent text-white hover:bg-black enabled:active:border-black basis-1/2"
                      onClick={verticalView} disabled={!vertical ? "" : true}>Vertical view</button>
                  </div>
                  <div className="flex">
                    <button type="button" className="p-[1px] m-[1px] border-[1px] disabled:border-transparent text-white hover:bg-black enabled:active:border-black basis-1/2"
                      onClick={zoomIn}>Zoom In</button>
                    <button type="button" className="p-[1px] m-[1px] border-[1px] disabled:border-transparent text-white hover:bg-black enabled:active:border-black basis-1/2"
                      onClick={zoomOut}>Zoom Out</button>
                  </div>
                  <button type="button" className="p-[1px] m-[1px] border-[1px] disabled:border-transparent text-white hover:bg-black enabled:active:border-black w-full"
                    onClick={onReset}>Reset</button>
                  <div>
                    <input type="range" name="posinput" min={0} max={n} value={pos} onChange={onPosRangeChange} />
                    <span>Position</span>
                  </div>
                </div>
              }

              <Scene embedded ortho wasd-controls>
                <Entity primitive='a-sky' color="white"></Entity>
                <Entity primitive='a-plane' color="grey" material="opacity: 0.5" rotation="-90 0 0" width="30" height="30"></Entity>

                <Entity primitive='a-mixin' id="moveToPos" animation="property: position; to: 0 0 0" />
                <Entity primitive='a-mixin' id="moveFar" animation="property: position; to: 0 0 15" />
                <Entity primitive='a-mixin' id="moveBack" animation="property: position; to: 0 0 0" />

                <Entity rotation="20 -45 -20" position="2 -0.3 -4"
                  animation="property: rotation; to: 0 -90 -90; startEvents: vertical"
                  animation__2="property: rotation; to: 20 -45 -20; startEvents: original">
                  <Entity scale={{ x: scale, y: scale, z: scale }} ref={rootRef} key={updateCounter}>
                    {
                      draw3DGraphs(rootmap).map((a, i) => drawAFrameGraph(a, i))
                    }
                  </Entity>
                </Entity>

                <Entity laser-controls="hand: left" raycaster="objects: .raycastable; far: 5"></Entity>
                <Entity laser-controls="hand: right" raycaster="objects: .raycastable; far: 5"></Entity>
              </Scene>

            </div>
            <div className="basis-2/5 flex flex-col bg-white overflow-hidden shadow rounded-lg">
              <D3 className="h-full" data={rootmap[selected]} />
            </div>
          </div>
        </div>
        <div className="flex flex-row bg-[#111827] text-white opacity-80 overflow-hidden shadow">
          <div className="flex-auto"><span>Start: </span><span className="font-bold" />{stat.start}</div>
          <div className="flex-auto"><span>End: </span><span className="font-bold" />{stat.end}</div>
          <div className="flex-auto"><span>Epoch: </span><span className="font-bold" />{stat.epoch}</div>
          <div className="flex-auto"><span>Max stack depth: </span><span className="font-bold" />{stat.maxStackDepth}</div>
        </div>
      </div>
    </div>
  );
}

export default VR
