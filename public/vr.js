const colorHue = 'warm'

let cameraB = false
let selected = 0
var num_graphs = 20
var data

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

function stringHash(s) {
    var hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function nameToColor(name) {
    return colorHash(name)
}

function handleData(trace, num_graph) {
    // trace should be a array and not null
    if (trace.length <= 0) return

    let traceStartTime = trace[0].start
    let traceEndTime = Math.max(...trace.map(e => e.start + e.dur))
    let maxStackDepth = Math.max(...trace.map(e => e.stack.length))

    const epoch_time = (traceEndTime - traceStartTime) / num_graph

    console.log(`traceTime:${traceStartTime} - ${traceEndTime}`)
    console.log(`maxStackDepth:${maxStackDepth}`)

    let root = []
    for (let index = 0; index < num_graph; index++) {
        root.push({ "name": "root", descendants: {}, level: 0, top: false })
    }

    for (const e of trace) {
        handleStack(root, e, traceStartTime, epoch_time)
    }

    return root.map(v => Object.values(v.descendants)[0])
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

function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(attr => {
        element.setAttribute(attr, attributes[attr]);
    });
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

function drawABox(box) {
    let b = document.createElement('a-box')

    const attr = {
        depth: `${box.d}`,
        height: `${box.h}`,
        width: `${box.w}`,
        color: `${box.c}`,
        position: `${box.x} ${box.y} ${box.z}`,
        material: `opacity: ${box.opacity}`,
    }

    setAttributes(b, attr)

    if (box.w > box.text.length * 0.1) {
        let text = document.createElement('a-text')
        text.setAttribute('value', box.text)
        text.setAttribute('position', `${-box.w / 2} 0 ${box.d / 2}`)
        b.appendChild(text)
    }

    return b
}

function drawAFrameGraph(boxes) {
    let entity = document.createElement('a-entity')
    for (const b of boxes) {
        entity.appendChild(drawABox(b))
    }

    return entity
}

const default_depth = 0.2
const default_height = 0.2
const default_graph_gap = 0.1
const max_width = 6
// Suitable width with default viewpoint

function draw3DGraphs(root) {
    const start_x = max_width / 2

    const start_y = default_height / 2
    const start_z = -(root.length * default_depth + (root.length - 1) * default_graph_gap) / 2

    const bs = root.map(e => Object.values(e.descendants)[0].value)
    const width_list = bs.map(e => e / Math.max(...bs))


    let allBoxes = []

    for (let index = 0; index < root.length; index++) {
        const e = root[index];

        const width = max_width * width_list[index]

        let boxes = drawSubBox(e,
            start_x - width / 2, start_y, start_z + index * (default_depth + default_graph_gap),
            width)

        allBoxes.push(boxes)
    }

    return allBoxes
}

function drawSubBox(ele, x, y, z, width) {
    let boxes = [];

    const color = nameToColor(ele.name)
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

const max_pixel = 100;

// from center and draw from center
function drawRect(ctx, x, y, l, w, c) {

    ctx.fillStyle = c;
    ctx.fillRect(x - l, y - w, l * 2, w * 2);
}

function drawVertical2DView(ctx, data) {

    const all_data = data.flat().filter(d => d.top).sort((a, b) => a.y - b.y)
    for (d of all_data) {
        drawRect(ctx, d.z / max_width * max_pixel + max_pixel / 2,
            d.x / max_width * max_pixel + max_pixel / 2,
            default_depth / 2 * max_pixel / max_width,
            d.w / 2 * max_pixel / max_width,
            d.c)
    }
}

AFRAME.registerComponent('ortho', {
    init: function () {
        var sceneEl = this.el.sceneEl;
        this.orthoCamera = new THREE.OrthographicCamera(0, 4, 0.75);
        sceneEl.camera = this.orthoCamera;

        sceneEl.addEventListener('render-target-loaded', () => {
            this.originalCamera = sceneEl.camera;
            this.cameraParent = sceneEl.camera.parent;
            this.orthoCamera = new THREE.OrthographicCamera(0, 4, 0.75);
            this.cameraParent.add(this.orthoCamera);
            sceneEl.camera = this.orthoCamera;
        });
    },
    remove: function () {
        this.cameraParent.remove(this.orthoCamera);
        sceneEl.camera = this.originalCamera;
    }
});

let rootmap;

function updateAFrame() { }

function update2D() { }

function updateD3() {
    const m = mapToD3Tree(rootmap[selected])
    d3.select("#chart")
        .datum(m)
        .call(chart);

    document.getElementById("numfg").innerHTML = selected
}

function updateAll() {
    // Clear AFrame
    let ele = document.getElementById('root')
    ele.innerHTML = ''
    if (cameraB) {
        ele.setAttribute('rotation', "20 -45 -20")
        ele.setAttribute('position', "2 -0.3 -4")
        ele.setAttribute('scale', "0.3 0.3 0.3")
    } else {
        ele.setAttribute('rotation', "20 -45 -20")
        ele.setAttribute('position', "2 -0.3 -4")
        ele.setAttribute('scale', "0.3 0.3 0.3")
    }

    // Handle Data
    const rootMap = handleData(data, num_graphs)
    rootmap = rootMap

    // Regenerate D3
    updateD3()

    // Draw 3d flamegraphs
    const all = draw3DGraphs(rootMap);
    all.forEach(a => { ele.appendChild(drawAFrameGraph(a)) })

    // Draw Canvas
    let canvas = document.getElementById('my-canvas')
    canvas.width = canvas.width
    let ctx = canvas.getContext('2d');

    drawVertical2DView(ctx, all)
}

function increasefg() {
    num_graphs++
    updateAll()
}

function decreasefg() {
    num_graphs--
    updateAll()
}

function rotate() {
    cameraB = true
    updateAll()
}

function reset() {
    cameraB = false
    updateAll()
}

function nextFlameGraph() {
    if (selected < num_graphs - 1) {
        selected++
        updateD3()
    }
}

function prevFlameGraph() {
    if (selected > 0) {

        selected--
        updateD3()
    }
}

function verticalView() {
    let ele = document.getElementById('root')
    ele.emit('vertical')
}

function originalView() {
    let ele = document.getElementById('root')
    ele.emit('original')
}

var chart = flamegraph()
    .width(600);

function onInputfile(e) {
    const reader = new FileReader()
    reader.onload = function (e) {
        const text = (e.target.result)
        const d = JSON.parse(text)

        data = d
        updateAll()
    }
    reader.readAsText(e.target.files[0])
}

document.addEventListener('DOMContentLoaded', function () {
    let ipFile = document.getElementById('fileinput')
    ipFile.addEventListener('change', onInputfile)
});
