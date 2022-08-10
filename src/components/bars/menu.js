/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
import React from 'react';
import {Dialog, Disclosure, Transition} from '@headlessui/react';
import {
  ChevronLeftIcon, FolderIcon,
  HomeIcon, UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import {inject, observer} from 'mobx-react';
import {Fragment, useState} from 'react';
import 'tw-elements';
import {PropTypes} from 'prop-types';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Menu(props) {
  console.log(props);
  const [currentProfileOpen, setCurrentProfileOpen] = useState(true);
  const [currentVRTraceOpen, setCurrentVRTraceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(true);
  const [VRProfileOpen, setVRProfileOpen] = useState(false);
  return (
    <div>
      <div className="space-y-1">
        {props.BarStore.showCurrentProfile &&
           <div>
             <button
               className=" text-gray-600  dark:text-white dark:hover:bg-slate-400
               hover:bg-slate-200 hover:text-gray-900 group w-full flex items-center
             pl-4 pr-1 py-2 text-left text-sm font-medium rounded-md
             focus:outline-none ocus:ring-2 focus:ring-indigo-500"
               onClick={() => setCurrentProfileOpen(!currentProfileOpen)}
             >
               <HomeIcon
                 className="mr-3 flex-shrink-0 h-6 w-6
                 text-gray-400 group-hover:text-gray-500"
                 aria-hidden="true"
               />
               <span className="flex-1">Current Profile</span>
               <svg
                 className={classNames(
                  currentProfileOpen ? 'text-gray-400 rotate-90' :
                   'text-gray-300',
                  'ml-3 flex-shrink-0 h-5 w-5 transform',
                  'group-hover:text-gray-400',
                  'transition-colors ease-in-out duration-150',
                 )}
                 viewBox="0 0 20 20"
                 aria-hidden="true"
               >
                 <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
               </svg>
             </button>
             {currentProfileOpen && ( < div className="space-y-1">
               <>
                 <div className={` ${
      props.ViewStore.currentComponent ==='flamegraph'? 'text-white bg-[#bc3793]' : 'text-gray-600'} dark:text-slate-200  group w-full flex
    items-center pl-[3.3rem] pr-2 py-2
    text-sm font-medium 
     rounded-md hover:text-gray-900 hover:bg-slate-200 dark:hover:bg-slate-400`}
                 onClick={() => props.ViewStore.setCurrentFlameGraph()}
                 >

                 Flame Graph
                 </div>
               </>
               <div className={` ${
      props.ViewStore.currentComponent ==='treetable'? 'text-white bg-[#bc3793]' : 'text-gray-600'
               }  dark:text-slate-200 group w-full flex
    items-center pl-[3.3rem] pr-2 py-2
    text-sm font-medium 
     rounded-md hover:text-gray-900 hover:bg-slate-200 dark:hover:bg-slate-400`}
               onClick={() => props.ViewStore.setCurrentTreeTable()}
               >
                 Tree Table
               </div>
             </div>)}
           </div>
        }


        <button
          as="div"
          className=" dark:text-white text-gray-600 hover:bg-slate-200 hover:text-gray-900 group w-full flex items-center
            pl-4 pr-1 py-2 text-left text-sm font-medium rounded-md
            focus:outline-none ocus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-400"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <UsersIcon
            className="mr-3 flex-shrink-0 h-6 w-6
                text-gray-400 group-hover:text-gray-500 "
            aria-hidden="true"
          />
          <span className="flex-1">Profile</span>
          <svg
            className={classNames(
                 profileOpen ? 'text-gray-400 rotate-90' :
                  'text-gray-300',
                 'ml-3 flex-shrink-0 h-5 w-5 transform',
                 'group-hover:text-gray-400',
                 'transition-colors ease-in-out duration-150',
            )}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
          </svg>
        </button>
        {profileOpen && ( < div className="space-y-1">
          <div

            className=" dark:text-slate-200 group w-full flex
                 items-center pl-[3.3rem] pr-2 py-2
                 text-sm font-medium text-gray-600
                  rounded-md hover:text-gray-900 hover:bg-slate-200 dark:hover:bg-slate-400"
          >
                Open File
          </div>
          <div
            className="dark:text-slate-200 group w-full flex
                 items-center pl-[3.3rem] pr-2 py-2
                 text-sm font-medium text-gray-600
                  rounded-md hover:text-gray-900 hover:bg-slate-200 dark:hover:bg-slate-400"
          >
                Example Profile
          </div>
        </div>)}


        <button
          className=" dark:text-white text-gray-600 hover:bg-slate-200 hover:text-gray-900 group w-full flex items-center
            pl-4 pr-1 py-2 text-left text-sm font-medium rounded-md
            focus:outline-none ocus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-400"
          onClick={() => setVRProfileOpen(!VRProfileOpen)}
        >
          <UsersIcon
            className="mr-3 flex-shrink-0 h-6 w-6
                text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          <span className="flex-1">VR Profile</span>
          <svg
            className={classNames(
                 VRProfileOpen ? 'text-gray-400 rotate-90' :
                  'text-gray-300',
                 'ml-3 flex-shrink-0 h-5 w-5 transform',
                 'group-hover:text-gray-400',
                 'transition-colors ease-in-out duration-150',
            )}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
          </svg>
        </button>
        {VRProfileOpen && ( <div className="space-y-1">
          <div

            className="group w-full flex dark:text-slate-200
                 items-center pl-[3.3rem] pr-2 py-2
                 text-sm font-medium text-gray-600
                  rounded-md hover:text-gray-900 hover:bg-slate-200 dark:hover:bg-slate-400"
          >
                Example VR Trace
          </div>
        </div>)}
      </div>
    </div>
  );
}
export default inject('BarStore', 'ViewStore')(observer(Menu));
