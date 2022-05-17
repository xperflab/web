import React, { Component, useState } from "react";
import { useCallback } from "react";
import Search from "./compoents/search";
import Sidebar from "./compoents/sidebar";
import open_file from "./pages/open_file";
import { useDropzone } from 'react-dropzone';
import { Route, Switch, useHistory } from 'react-router-dom'
import FlameGraph from "./pages/flame_graph";
var showCurrentFile = false;


function MyDropzone() {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(typeof binaryStr)
        localStorage.setItem('data', binaryStr)
        // let result = window.decodeProfile(binaryStr, '2')
        // console.log(result)
        // if (result == 0) {
        //   showCurrentFile = true
        //   let jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')()
        //   console.log(jsonStr)
        //   let fileExistList = JSON.parse(jsonStr)
        //   for (let i = 0; i < fileExistList.length; i++) {
        //     window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
        //   }
         window.location.href="/flame_graph";      
        //}
      }
      reader.readAsBinaryString(file)
    })

  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

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

render() {



  return (


    <>

      <div className="min-h-full flex">
        <Sidebar showCurrentFile={showCurrentFile} />

        <div className="lg:pl-64 flex flex-col w-0 flex-1">

          <main className="flex-1">
            <div className="py-8 xl:py-10">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
                <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
                  <div>
                    <Route path="/open_file">
                        <div>
                          <MyDropzone />

                        </div>
                      </Route>
                      <Route path="/flame_graph">
                        <FlameGraph />
                      </Route>
                      
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>



      </div>



    </>


  );
}
}

export default App;