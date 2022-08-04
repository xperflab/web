/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import {Dialog, Disclosure, Transition} from '@headlessui/react';
import {
  ChevronLeftIcon, FolderIcon,
  HomeIcon, UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import {inject, observer} from 'mobx-react';
import {Fragment, React, useState} from 'react';
import 'tw-elements';
import {PropTypes} from 'prop-types';
import Menu from './menu';
import Toggle from '../widget/toggle';
/**
  * Combine the className in if condition render
  * @param  {...any} classes
  * @return {String}
  */


/**
 * inject('BarStore')
 * @param {App} props
 * @return {LeftBar}
 */
function LeftBar(props) {
  return (
    <div >
      <Transition.Root show={props.BarStore.sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden"
          onClose={props.BarStore.setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1
             flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center
                     justify-center h-10 w-10
                      rounded-full focus:outline-none
                      focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() =>
                        props.BarStore.setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6
                     text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4 ">
                  <img
                    className="h-8 w-auto"
                    src="/new_logo.png"
                    alt="Workflow"
                  />
                  <div className="text-xl pl-3 font-bold
              text-black">
                Easy<span
                      className="font-medium text-transparent
                   bg-clip-text bg-gradient-to-br
                   from-[#fe4ba1] to-[#4a247c]">View</span>
                  </div>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    <Menu/>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar
             to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <div
        className={` ${
       props.BarStore.showSidebar ? 'md:w-[15rem] ' : 'w-0'
        } hidden md:flex md:flex-col  md:fixed md:inset-y-0 duration-200 bg-gray-100 dark:bg-slate-900`}
      >
        <div className="  flex flex-col flex-grow border-r
       border-gray-200 overflow-y-auto overflow-hidden  dark:bg-slate-900 dark:border-slate-600">
          <div className="flex items-center flex-shrink-0 px-4 pt-2  dark:bg-slate-900">
            <img
              className="h-8 w-auto"
              src="/new_logo.png"
              alt="Workflow"
            />
            <div className="text-xl pl-3 font-bold
              text-black">
                Easy<span
                className="font-medium text-transparent
                   bg-clip-text bg-gradient-to-br
                   from-[#fe4ba1] to-[#4a247c]">View</span>
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() =>props.BarStore.setShowSidebar(false)}
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block px-6 py-2.5 ml-7"
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample"
                aria-expanded="false" aria-controls="collapseExample"
              ><ChevronLeftIcon className="h-6 w-6 dark:text-slate-400"/></button>
            </div>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2
           space-y-1" aria-label="Sidebar">
              <Menu/>
            </nav>
            <div className="flex items-center justify-center mb-10">     <Toggle/><div className="ml-3 dark:text-slate-400">dark mode</div></div>

          </div>

        </div>

      </div>

    </div>
  );
}
LeftBar.propTypes = {
  BarStore: PropTypes.object.isRequired,
};

export default inject('BarStore', 'ViewStore')(observer(LeftBar));

