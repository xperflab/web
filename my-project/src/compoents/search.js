import React, { Component } from 'react'
import {
    BellIcon,
    CalendarIcon,
    ChatAltIcon,
    CheckCircleIcon,
    LockOpenIcon,
    PencilIcon,
    SearchIcon,
    TagIcon,
    UserCircleIcon as UserCircleIconSolid,
  } from '@heroicons/react/solid'
export default class search extends Component {
    render() {
        return (
            <div>   
                 <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
                <div className="flex-1 px-4 flex justify-between">
                    <div className="flex-1 flex">
                        <form className="w-full flex lg:ml-0" action="#" method="GET">
                            <label htmlFor="search-field" className="sr-only">
                                Search
                            </label>
                            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <input
                                    id="search-field"
                                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                    placeholder="Search"
                                    type="search"
                                    name="search"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="ml-4 flex items-center lg:ml-6">
                        {/* <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Create
          </button> */}
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
