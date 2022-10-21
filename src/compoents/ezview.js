const instance = window.Module

let ezview = {}
window.ezview = ezview

// Export wasm instance for debugging
ezview.i = instance

// Call back from wasm
// In C++ code, we call this code from EM_ASM
ezview.cb = {}

// Memory cache for wasm
// In Wasm32, the max size of memory is 4GB
let mem_map = new Map() // name - arrayBuffer
let name_sz_m = new Map()

ezview.mm = mem_map

ezview.newCache = (namePtr, size) => {
    let name = instance.AsciiToString(namePtr)
    mem_map.set(name, new Map())
    name_sz_m.set(name, size)
    console.log("new cache " + name + " size " + size)
}

ezview.deleteCache = name => {
    mem_map.delete(name)
    name_sz_m.delete(name)
    console.log("delete memory cache " + name)
}

ezview.swapInJS = function (namePtr, index, bufAddr) {
    let name = instance.AsciiToString(namePtr)
    let size = name_sz_m.get(name)

    let dst = new ArrayBuffer(size);
    new Uint8Array(dst).set(instance.HEAPU8.slice(bufAddr, bufAddr + size));

    mem_map.get(name).set(index, dst)
    return 0;
}

ezview.swapOutJS = function (namePtr, index, bufAddr) {
    let name = instance.AsciiToString(namePtr)

    let m = mem_map.get(name)
    let mem = m.get(index)
    if (!m || !mem) {
        console.log(name)
        return -1;
    }

    instance.HEAPU8.set(new Uint8Array(mem), bufAddr)
    m.delete(name);
    return 0;
}


export const bufferSize = 128 * 1024 * 1024;
async function parsePart(buf) {
    // delete all used db
    indexedDB.deleteDatabase('td')

    if (bufAddr == 0) {
        bufAddr = instance._initBufferAddr(bufferSize)
    }
    instance.writeArrayToMemory(buf, bufAddr + remain);

    return await instance.ccall('parsePart', 'number', ['number'], [buf.length + remain], { async: true });
}

async function build() {
    console.log("build finished.")
    return await instance.ccall('build', '', [], [], { async: true });
}

function isPProf() {
    return instance._isPProf()
}

function setRewind() {
    return instance._setRewind()
}

export function setCallback(name, callback) {
    ezview.cb[name] = callback
}

let bufAddr = 0
let remain = 0

export const getRootID = instance.cwrap('getRootID', 'string')

export const getSourceFileJsonStr = instance.cwrap('getSourceFileJsonStr', 'string')

export const getMetricDesJsonStr = instance.cwrap('getMetricDesJsonStr', 'string')

export const getTreeTableChildrenList = instance.cwrap('getTreeTableChildrenList', 'string', ['number'])

export const getClickNodeMessage = instance.cwrap('getClickNodeMessage', 'string', ['number', 'number', 'number'])

export const getContextDetails = instance.cwrap('getContextDetails', 'string', ['number'])

export const getContextName = instance.cwrap('getContextName', 'string', ['number'])

export const updateSourceFileExistStatus = instance.cwrap('updateSourceFileExistStatus', '', ['number', 'number'])

export const updateValueTree = instance.cwrap('updateValueTree', '', ['number', 'number', 'number'], { async: true })

export const drawFlameGraphClickNode = instance.cwrap('drawFlameGraphClickNode', '', ['number', 'number', 'number', 'number', 'number'], { async: true })

export const setFunctionFilter = instance.cwrap('setFunctionFilter', '', ['string'])

export const setUpDrawFlameGraph = f => instance._setUpDrawFlameGraph(-1, instance.addFunction(f, 'viiiiiji'));

export const sortContextTreeByMetricIdx = instance.cwrap('sortContextTreeByMetricIdx', '', ['number', 'number'])

export async function initFlatTree() {
    return await instance.ccall('initFlatTree', '', [''], [], { async: true });
}

export function initBUTree() {
    console.time("bu")
    return instance.ccall('initBUTree', '', [''], []);
}

export async function parseFile(f) {
    console.time("parse")
    console.log("file", f)
    let from = 0
    bufAddr = 0
    remain = 0

    while (true) {
        console.log(`Read from ${from} to ${from + bufferSize - remain}`)

        const s = f.slice(from, from + bufferSize - remain)
        if (s.size == 0)
            break

        // compatible for blob and arraybuffer
        const a = await s.arrayBuffer()

        let view = new Uint8Array(a);
        remain = await parsePart(view)

        if (remain == -1) {
            console.log("Error")
            break
        }
        from += view.length
    }

    if (isPProf()) {
        setRewind()
        console.log("Rewinding...")
        from = 0
        remain = 0

        while (true) {
            console.log(`Read from ${from} to ${from + bufferSize - remain}`)

            const s = f.slice(from, from + bufferSize - remain)
            console.log(`got ${s.size} bytes`)
            if (s.size == 0)
                break

            const a = await s.arrayBuffer()
            let view = new Uint8Array(a);
            remain = await parsePart(view)

            if (remain == -1) {
                console.log("Error")
                break
            }
            from += view.length
        }
    }

    let res = await build()
    console.timeEnd("parse")
    return Boolean(res)
}

