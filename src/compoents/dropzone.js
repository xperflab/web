import React, { Component } from 'react'

export default class MyDropzone extends Component {
  render() {
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
}
