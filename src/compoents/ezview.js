const instance = window.Module

export const bufferSize = 512 * 1024 * 1024; // 128M
function parsePart(buf) {
    // delete all used db
    indexedDB.deleteDatabase('td')

    if (bufAddr == 0) {
        bufAddr = instance._initBufferAddr(bufferSize)
    }
    instance.writeArrayToMemory(buf, bufAddr + remain);

    return instance.ccall('parsePart', 'number', ['number'], [buf.length + remain], {async: true});
}

function build() {
    console.log("build finished.")
    return instance.ccall('build', '', [], []);
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

export const getTreeTableChildrenList = instance.cwrap('getTreeTableChildrenList', 'string', ['number'], {async: true})

export const getClickNodeMessage = instance.cwrap('getClickNodeMessage', 'string', ['number', 'number', 'number'])

export const getContextDetails = Module.cwrap('getContextDetails', 'string', ['number'], {async: true})

export const getContextName = instance.cwrap('getContextName', 'string', ['number'])

export const updateSourceFileExistStatus = instance.cwrap('updateSourceFileExistStatus', '', ['number', 'number'])

export const updateValueTree = instance.cwrap('updateValueTree', '', ['number', 'number', 'number'], {async: true})

export const drawFlameGraphClickNode = instance.cwrap('drawFlameGraphClickNode', '', ['number', 'number', 'number', 'number', 'number'], {async: true})

export const setFunctionFilter = instance.cwrap('setFunctionFilter', '', ['string'])

export const setUpDrawFlameGraph = f => instance._setUpDrawFlameGraph(-1, instance.addFunction(f, 'viiiiiji'));

export const sortContextTreeByMetricIdx = instance.cwrap('sortContextTreeByMetricIdx', '', ['number', 'number'])



// export async function parseFile(f) {
//     console.time("parse")
//     console.log("file", f)
//     let from = 0
//     bufAddr = 0
//     remain = 0

//     while (true) {
//         console.log(`Read from ${from} to ${from + bufferSize - remain}`)

//         const s = f.slice(from, from + bufferSize - remain)
//         if (s.size == 0)
//             break

//         // compatible for blob and arraybuffer
//         const a = await s.arrayBuffer()

//         let view = new Uint8Array(a);
//         remain = parsePart(view)

//         if (remain == -1) {
//             console.log("Error")
//             break
//         }
//         from += view.length
//     }



//     if (isPProf()) {
//         setRewind()
//         console.log("Rewinding...")
//         from = 0
//         remain = 0

//         while (true) {
//             console.log(`Read from ${from} to ${from + bufferSize - remain}`)

//             const s = f.slice(from, from + bufferSize - remain)
//             console.log(`got ${s.size} bytes`)
//             if (s.size == 0)
//                 break

//             const a = await s.arrayBuffer()
//             let view = new Uint8Array(a);
//             remain = parsePart(view)

//             if (remain == -1) {
//                 console.log("Error")
//                 break
//             }
//             from += view.length
//         }
//     }

//     let res = build()
//     console.timeEnd("parse")
//     return Boolean(res)
// }

export async function parseFile(f) {
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

    let res = build()
    console.timeEnd("parse")
    return Boolean(res)
}