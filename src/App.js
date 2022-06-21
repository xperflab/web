import React, { Component, useState, useEffect } from "react";
import { useCallback } from "react";
import Sidebar from "./components/sidebar";
import { useDropzone } from 'react-dropzone';
import FlameGraph from "./components/flame_graph";
import Treetable from "./components/treetable";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Layout, Spin } from "antd";
import { BsChevronDown} from "react-icons/bs";

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
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        setLoading(true)

        const binaryStr = reader.result
        console.log(binaryStr)
        let result = window.decodeProfile(binaryStr, file.type)
        console.log(result)
        if (result == 0) {
          let jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')()
          console.log(jsonStr)
          let fileExistList = JSON.parse(jsonStr)
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
          //window.navigate("/flame_graph");  
          changeComponentToFlamegraph()
          changeShowCurrentProfile()
          window.postMessage(
            {
              type: "Select Flamegraph",
              data: ""
            }
          );
        }
      }
      reader.readAsArrayBuffer(file)
      //  reader.readAsBinaryString(file)
    })

  }, [])
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

  componentDidMount() {


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
      <div className="flex">
     
          <Sidebar changeComponentToDropzone={this.changeComponentToDropzone}
            changeComponentToVR={this.changeComponentToVR}
            changeComponentToFlamegraph={this.changeComponentToFlamegraph}
            changeComponentToTreetable={this.changeComponentToTreetable}
            showCurrentProfile={this.state.showCurrentProfile}
            changeShowCurrentProfile={this.changeShowCurrentProfile}
          />
 
       
            
        
        
        <div className="h-screen flex-1 p-7">
        {
                renderComponent
              }
       </div>
       </div>


      </>


    );
  }
}

export default App;