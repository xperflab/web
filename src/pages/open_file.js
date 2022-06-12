import React, { Component } from 'react'
import Sidebar from '../compoents/sidebar'

export default class open_file extends Component {
  render() {
    return (
      <>
        <div className="min-h-full flex">
          <Sidebar />
          <div className="lg:pl-64 flex flex-col w-0 flex-1">
            <main className="flex-1">
              <div className="py-8 xl:py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
                  <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
                    <div>
                      <div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    )
  }
}
