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
var showCurrentFile = false;


function MyDropzone(props) {
  const {changeComponentToFlamegraph} = props
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
        var uint8View = new Uint8Array(binaryStr);
        console.log(uint8View)
        let result = window.decodeProfile(binaryStr, file.type)
        console.log(result)
         if (result == 0) {
          showCurrentFile = true
          let jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')()
           console.log(jsonStr)
          let fileExistList = JSON.parse(jsonStr)
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
        //window.navigate("/flame_graph");  
          changeComponentToFlamegraph()

        
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
    this.state = { showComponent: "dropzone" };
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
    renderComponent = (<MyDropzone changeComponentToFlamegraph  ={this.changeComponentToFlamegraph}/>)
  } else if (this.state.showComponent === "flamegraph") {
    renderComponent = (<FlameGraph isShow = {true}/>)
  } else if(this.state.showComponent === "VR") {
    renderComponent =(<VR/>)
  } else if(this.state.showComponent === "treetable") {
    renderComponent =(<Treetable/>)
  } 


  return (


    <>

      <div className="min-h-full flex">
        <Sidebar changeComponentToDropzone = {this.changeComponentToDropzone}  
        changeComponentToVR ={this.changeComponentToVR}
        changeComponentToFlamegraph ={this.changeComponentToFlamegraph}
        changeComponentToTreetable ={this.changeComponentToTreetable}/>

        <div className="lg:pl-64 flex flex-col w-0 flex-1">

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
        </div>



      </div>


    </>


  );
}
}

export default App;