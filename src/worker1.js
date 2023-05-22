    // worker.js

    // Polyfill instantiateStreaming for browsers missing it
    if (!WebAssembly.instantiateStreaming) {
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
                const source = await (await resp).arrayBuffer();
                return await WebAssembly.instantiate(source, importObject);
        };
    }

    // Create promise to handle Worker calls whilst
    // module is still initialising
    let wasmResolve;
    let wasmReady = new Promise((resolve) => {
        wasmResolve = resolve;
    })

    // Handle incoming messages
    self.addEventListener('message', function(event) {

        const { eventType, eventData, eventId } = event.data;

        if (eventType === "INITIALISE") {
            WebAssembly.instantiateStreaming(fetch(eventData), {})
                .then(instantiatedModule => {
                    const wasmExports = instantiatedModule.instance.exports;

                    // Resolve our exports for when the messages
                    // to execute functions come through
                    wasmResolve(wasmExports);

                    // Send back initialised message to main thread
                    self.postMessage({
                        eventType: "INITIALISED",
                        eventData: Object.keys(wasmExports)
                    });
        
                });
        } else if (eventType === "CALL") {
            wasmReady
                .then(async (wasmInstance) => {
                    // const method = wasmInstance[eventData.method];
                    // const result = method.apply(null, eventData.arguments);
                const bufferSize = 128 * 1024 * 1024; // 128M
                let bufAddr = 0
                let remain = 0 
                const parsePart = (buf) => {
                    // delete all used db
                    indexedDB.deleteDatabase('td')
                
                    if (bufAddr == 0) {
                        bufAddr = wasmInstance._initBufferAddr(bufferSize)
                    }
                    wasmInstance.writeArrayToMemory(buf, bufAddr + remain);
                
                    return wasmInstance.ccall('parsePart', 'number', ['number'], [buf.length + remain]);
                }
                    
                const build = async () => {
                    console.log("build finished.")
                    return wasmInstance.ccall('build', '', [], []);
                }
                    
                const isPProf = () => {
                        return wasmInstance._isPProf()
                }
                    
                const setRewind = () => {
                        return wasmInstance._setRewind()
                }

                console.time("parse")
                console.log("file", eventData.arguments)
                let from = 0
                bufAddr = 0
                remain = 0

                // let range = [];
                while (true) {
                    console.log(`Read from ${from} to ${from + bufferSize - remain}`)

                    const s = f.slice(from, from + bufferSize - remain)
                    if (s.size == 0)
                        break

                    // compatible for blob and arraybuffer
                    const a = await s.arrayBuffer()

                    let view = new Uint8Array(a);
                    // range.push(view);
                    parsePart(view)
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


                    self.postMessage({
                        eventType: "RESULT",
                        eventData: Boolean(res),
                        eventId: eventId
                    });
                })
                .catch((error) => {
                    self.postMessage({
                        eventType: "ERROR",
                        eventData: "An error occured executing WASM instance function: " + error.toString(),
                        eventId: eventId
                    });
                })
        }

    }, false);
