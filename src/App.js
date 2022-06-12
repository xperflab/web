import React, { Component, useState } from "react";
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

import "antd/dist/antd.css";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload,Layout } from "antd";

// const { Dragger } = Upload;
// const props = {
//   name: "file",
//   multiple: true,

//   onChange(info) {
//     const { status } = info.file;

//     if (status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }

//     if (status === "done") {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },

//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer);
//   }
// };

// const MyDropzone = () => (
  // <Dragger {...props}>
  //   <p className="ant-upload-drag-icon">
  //     <InboxOutlined />
  //   </p>
  //   <p className="ant-upload-text">Click or drag file to this area to upload</p>
  //   <p className="ant-upload-hint">
  //     Support for a single or bulk upload. Strictly prohibit from uploading
  //     company data or other band files
  //   </p>
  // </Dragger>
// );


function MyDropzone(props) {
  const { Dragger } = Upload;
  const {changeComponentToFlamegraph, changeShowCurrentProfile} = props
  //   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer);
//   }
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
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
        }
      }
      reader.readAsArrayBuffer(file)
    //  reader.readAsBinaryString(file)
    })

  }, [])
  // const { getRootProps, getInputProps } = useDropzone({ onDrop,accept: {
  //   'image/jpeg': [],
  //   'image/png': []
  // } })
  const { getRootProps, getInputProps } = useDropzone({ onDrop
  })

  return (
    <div>

<Dragger {...getRootProps()}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading
      company data or other band files
    </p>
  </Dragger>
    </div>
  )
  return (
    <div>

      <div {...getRootProps()}>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-8 sm:px-0">

              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" >

                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>

              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </div>
  )
}




class App extends Component {
  constructor() {
    super();
    this.state = { showComponent: "dropzone" ,
    showCurrentProfile:false
    
  };
  }
  changeShowCurrentProfile=() =>{
    console.log("changetotrue")
    this.setState({
      showCurrentProfile:true
    })
  }
  changeComponentToFlamegraph = () => {
    this.setState({
        showComponent : "flamegraph"
    })
  }
  changeComponentToDropzone = () => {
    this.setState({
        showComponent : "dropzone"
    })
  }
  changeComponentToVR = () => {
    this.setState({
        showComponent : "VR"
    })
  }
  changeComponentToTreetable = () =>{
    this.setState({
      showComponent : "treetable"
  })
  }
render() {
  

  let renderComponent;
  if (this.state.showComponent === "dropzone") {
    renderComponent = (<MyDropzone changeComponentToFlamegraph  ={this.changeComponentToFlamegraph} changeShowCurrentProfile={this.changeShowCurrentProfile}/>)
  } else if (this.state.showComponent === "flamegraph") {
    renderComponent = (<FlameGraph isShow = {true}/>)
  } else if(this.state.showComponent === "VR") {
    renderComponent =(<VR/>)
  } else if(this.state.showComponent === "treetable") {
    renderComponent =(<Treetable/>)
  } 
  const { Header, Sider, Content } = Layout;
  return (


    <>
  <Layout>
  <Sidebar changeComponentToDropzone = {this.changeComponentToDropzone}  
        changeComponentToVR ={this.changeComponentToVR}
        changeComponentToFlamegraph ={this.changeComponentToFlamegraph}
        changeComponentToTreetable ={this.changeComponentToTreetable}
        showCurrentProfile={this.state.showCurrentProfile}
        changeShowCurrentProfile={this.changeShowCurrentProfile}
        />
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >

        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
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
        <Sidebar changeComponentToDropzone = {this.changeComponentToDropzone}  
        changeComponentToVR ={this.changeComponentToVR}
        changeComponentToFlamegraph ={this.changeComponentToFlamegraph}
        changeComponentToTreetable ={this.changeComponentToTreetable}
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