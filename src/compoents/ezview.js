const instance = window.Module

export const bufferSize = 128 * 1024 * 1024;
async function parsePart(buf) {
    if (bufAddr == 0) {
        bufAddr = instance._initBufferAddr(bufferSize)
    }
    instance.writeArrayToMemory(buf, bufAddr + remain);

    return await instance.ccall('parsePart', 'number', ['number'], [buf.length + remain], { async: true });
}

async function build() {
    await instance.ccall('build', '', [], [], { async: true });
    console.log("build finished.")
}

function isPProf() {
    return instance._isPProf()
}

function setRewind() {
    return instance._setRewind()
}

let bufAddr = 0
let remain = 0

export const getSourceFileJsonStr = instance.cwrap('getSourceFileJsonStr', 'string')

export const getClickNodeMessage = instance.cwrap('getClickNodeMessage', 'string', ['number', 'number', 'number'])

export const updateValueTree = instance.cwrap('updateValueTree', '', ['number', 'number', 'number'], { async: true })

export const drawFlameGraphClickNode = instance.cwrap('drawFlameGraphClickNode', '', ['number', 'number', 'number', 'number', 'number'], { async: true })

export async function parseFile(f) {
    console.time("parse")
    console.log("file", f)
    let from = 0

    while (true) {
        console.log(`Read from ${from} to ${from + bufferSize - remain}`)

        const s = f.slice(from, from + bufferSize - remain)
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

    await build()
    console.timeEnd("parse")
}

