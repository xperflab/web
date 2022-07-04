import React, { Component, useState, useEffect } from "react";
import { useCallback } from "react";
import Search from "./compoents/search";
import Sidebar from "./compoents/sidebar";
import open_file from "./pages/open_file";
import { useDropzone } from 'react-dropzone';
import { Route, Switch, useHistory } from 'react-router-dom'
import FlameGraph from "./pages/flame_graph";
import VR from "./pages/vr"
import Treetable from "./pages/treetable";
import './pages-css/header.css'
import './pages-css/table.css'
import './pages-css/responsive.css'
import './pages-css/d3-flamegraph.css'
import "antd/dist/antd.min.css";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Layout, Spin } from "antd";

let bufAddr = 0
let remain = 0

const instance = window.Module

export const bufferSize = 128 * 1024 * 1024;
function parsePart(buf) {
  if (bufAddr == 0) {
    bufAddr = instance._initBufferAddr(bufferSize)
  }
  instance.writeArrayToMemory(buf, bufAddr + remain)
  remain = instance._parsePart(buf.length + remain)
  return remain
}

function build() {
  instance._build()
  console.log("build finished.")
}

function isPProf() {
  return instance._isPProf()
}

function setRewind() {
  return instance._setRewind()
}


function MyDropzone(props) {
  const { Dragger } = Upload;
  const [loading, setLoading] = useState(false)
  const { changeComponentToFlamegraph, changeShowCurrentProfile } = props
  //   onDrop(e) {
  //     console.log("Dropped files", e.dataTransfer);
  //   }

  useEffect(() => {
    console.log(loading);
  }, [loading]);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (f) => {
      console.time('Parse')
      console.log("file", f)
      let from = 0

      while (true) {
        console.log(`Read from ${from} to ${from + bufferSize - remain}`)

        const s = f.slice(from, from + bufferSize - remain)
        if (s.size == 0)
          break

        const a = await s.arrayBuffer()
        let view = new Uint8Array(a);
        remain = parsePart(view)

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
          remain = parsePart(view)

          if (remain == -1) {
            console.log("Error")
            break
          }
          from += view.length
        }
      }

      build()
      let jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')()
      // console.log(jsonStr)
      let fileExistList = JSON.parse(jsonStr)
      for (let i = 0; i < fileExistList.length; i++) {
        window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
      }
      changeComponentToFlamegraph()
      changeShowCurrentProfile()
      console.timeEnd('Parse')

      // const reader = new FileReader()

      // reader.onabort = () => console.log('file reading was aborted')
      // reader.onerror = () => console.log('file reading has failed')
      // reader.onload = () => {
      //   // Do whatever you want with the file contents
      //   setLoading(true)

      //   const binaryStr = reader.result
      //   console.log(binaryStr)
      //   let result = window.decodeProfile(binaryStr, file.type)
      //   console.log(result)
      //   if (result == 0) {
      //     let jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')()
      //     console.log(jsonStr)
      //     let fileExistList = JSON.parse(jsonStr)
      //     for (let i = 0; i < fileExistList.length; i++) {
      //       window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
      //     }
      //     //window.navigate("/flame_graph");  
      //     changeComponentToFlamegraph()
      //     changeShowCurrentProfile()
      //     window.postMessage(
      //       {
      //         type: "Select Flamegraph",
      //         data: ""
      //       }
      //     );
      //   }
      // }
      // reader.readAsArrayBuffer(file)
      //  reader.readAsBinaryString(file)
    })

  }, [])
  // const { getRootProps, getInputProps } = useDropzone({ onDrop,accept: {
  //   'image/jpeg': [],
  //   'image/png': []
  // } })
  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  })

  return (

    <div>

      <div {...getRootProps()}>
        {loading ? <Spin> <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-8 sm:px-0">

              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column'
              }}>

                <input {...getInputProps()} />

                <p >
                  <InboxOutlined style={{ color: "#B73C93", fontSize: 106 }} />
                </p><br />
                <div style={{ fontSize: 26, color: "#262626" }}>Click or drag file to this area to decode</div>

              </div>
            </div>
            {/* /End replace */}
          </div>
        </main> </Spin> : <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-8 sm:px-0">

              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column'
              }}>

                <input {...getInputProps()} />

                <p >
                  <InboxOutlined style={{ color: "#B73C93", fontSize: 106 }} />
                </p><br />
                <div style={{ fontSize: 26, color: "#262626" }}>Click or drag file to this area to decode</div>

              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>}

      </div>
    </div>
  )
}




class App extends Component {
  constructor() {
    super();
    this.state = {
      showComponent: "dropzone",
      showCurrentProfile: false

    };
  }
  componentWillUnmount() {
    sessionStorage.setItem('runtimeReady', false);
  }
  componentWillMount() {
    //     Module['onRuntimeInitialized'] = () =>{
    //         console.log("Runtime Ready")
    //         runtimeReady = true
    //         window.postMessage(
    //     {
    //         type: "Runtime Ready",
    //         data: ""
    //     }
    // );
    //     }
  }
  componentDidMount() {
    console.log(sessionStorage.getItem('runtimeReady'))
    if (sessionStorage.getItem('runtimeReady')) {
      console.log("ready")
      setTimeout(() => {
        message.success("Runtime Ready")
      }, 200)
    }
    // window.addEventListener("message", (event) => {
    //   const msg = event.data; // The json data that the extension sent
    //   switch (msg.type) {
    //     case "Runtime Ready": {
    //       window.reciveMessage = true
    //       console.log("ready")
    //       setTimeout(() =>{
    //         message.success("Runtime Ready")
    //       },200)
    //     }
    //   }
    // })
  }
  changeShowCurrentProfile = () => {
    console.log("changetotrue")
    this.setState({
      showCurrentProfile: true
    })
  }
  changeComponentToFlamegraph = () => {
    this.setState({
      showComponent: "flamegraph"
    })
  }
  changeComponentToDropzone = () => {
    this.setState({
      showComponent: "dropzone"
    })
  }
  changeComponentToVR = () => {
    this.setState({
      showComponent: "VR"
    })
  }
  changeComponentToTreetable = () => {
    this.setState({
      showComponent: "treetable"
    })
  }
  render() {


    let renderComponent;
    if (this.state.showComponent === "dropzone") {
      renderComponent = (<MyDropzone changeComponentToFlamegraph={this.changeComponentToFlamegraph} changeShowCurrentProfile={this.changeShowCurrentProfile} />)
    } else if (this.state.showComponent === "flamegraph") {
      renderComponent = (<FlameGraph isShow={true} />)
    } else if (this.state.showComponent === "VR") {
      renderComponent = (<VR />)
    } else if (this.state.showComponent === "treetable") {
      renderComponent = (<Treetable />)
    }
    const { Header, Sider, Content } = Layout;
    return (


      <>
        <Layout>
          <Sidebar changeComponentToDropzone={this.changeComponentToDropzone}
            changeComponentToVR={this.changeComponentToVR}
            changeComponentToFlamegraph={this.changeComponentToFlamegraph}
            changeComponentToTreetable={this.changeComponentToTreetable}
            showCurrentProfile={this.state.showCurrentProfile}
            changeShowCurrentProfile={this.changeShowCurrentProfile}
          />
          <Layout className="site-layout">
            <Content
              className="site-layout-background"
              style={{
                // margin: '12px 8px',
                // padding: 1,
                minHeight: 280,
              }}
            >
              {
                renderComponent
              }
            </Content>
          </Layout>
        </Layout>
        <div className="min-h-full flex">


          {/* <div className="lg:pl-64 flex flex-col w-0 flex-1"> */}









        </div>


      </>


    );

    return (


      <>

        <div className="min-h-full flex">
          <Sidebar changeComponentToDropzone={this.changeComponentToDropzone}
            changeComponentToVR={this.changeComponentToVR}
            changeComponentToFlamegraph={this.changeComponentToFlamegraph}
            changeComponentToTreetable={this.changeComponentToTreetable}
            showCurrentProfile={this.state.showCurrentProfile}
            changeShowCurrentProfile={this.changeShowCurrentProfile}
          />

          {/* <div className="lg:pl-64 flex flex-col w-0 flex-1"> */}

          <main className="flex-1">



            <div>
              {
                renderComponent
              }
              {/* <Route path="/open_file">
                        <div>
                          <MyDropzone />

                        </div>
                      </Route>
                      <Route path="/flame_graph">
                        <FlameGraph />
                      </Route> */}



            </div>
          </main>
          {/* </div> */}



        </div>


      </>


    );
  }
}

export default App;