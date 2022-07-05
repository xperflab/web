/**
 * eslint require
 */
import {React} from 'react';

import {Dialog, Disclosure, Transition} from '@headlessui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon, FolderIcon,
  HomeIcon, MenuAlt2Icon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import {SearchIcon} from '@heroicons/react/solid';
import {Fragment, useState} from 'react';
import 'tw-elements';

const navigation = [
  {name: 'Dashboard', icon: HomeIcon, current: true, href: '#'},
  {
    name: 'Profile',
    icon: UsersIcon,
    current: false,
    children: [
      {name: 'Open File', href: '#'},
      {name: 'Example Profile', href: '#'},
    ],
  },
  {
    name: 'VR Profile',
    icon: FolderIcon,
    current: false,
    children: [
      {name: 'Example VR Trace', href: '#'},
    ],
  }];

/**
 * Combine the className in if condition render
 * @param  {...any} classes
 * @return {String}
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 *
 * Include sidebar and searchbar
 * @return {Bars}
 */
export default function Bars() {
  /**
   * When screen width is less than 768px, control open
   * sidebar or close sidebar.
   *
   */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /**
   * Click buttons to show the sidebar or hide the sidebar.
   */
  const [showSidebar, setShowSiderbar] = useState(true);
  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden"
          onClose={setSidebarOpen}>
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
                      onClick={() => setSidebarOpen(false)}
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
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) =>
            !item.children ? (
              <div key={item.name}>
                <a
                  href="#"
                  className={classNames(
                    item.current ?
                      'bg-gray-100 text-gray-900' :
                      'bg-white text-gray-600',
                    'hover:bg-gray-50 hover:text-gray-900',
                    'group w-full flex items-center',
                    'pl-2 py-2 text-sm font-medium rounded-md',
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current ?
                      'text-gray-500' :
                      'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6',
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({open}) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current ?
                          'bg-gray-100 text-gray-900' :
                          'bg-white text-gray-600',
                        'hover:bg-gray-50 hover:text-gray-900',
                        'group w-full flex items-center',
                        'pl-2 pr-1 py-2 text-left',
                        'text-sm font-medium rounded-md',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                      )}
                    >
                      <item.icon
                        className="mr-3 flex-shrink-0 h-6 w-6
                         text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      <svg
                        className={classNames(
                          open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                          'ml-3 flex-shrink-0 h-5 w-5 transform',
                          'group-hover:text-gray-400',
                          'transition-colors ease-in-out duration-150',
                        )}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children.map((subItem) => (
                        <Disclosure.Button
                          key={subItem.name}
                          as="a"
                          href={subItem.href}
                          className="group w-full flex
                          items-center pl-11 pr-2 py-2
                          text-sm font-medium text-gray-600
                           rounded-md hover:text-gray-900 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ),
                    )}
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
          showSidebar ? 'md:w-[16.3rem]' : 'w-0'
        } hidden md:flex md:flex-col md:fixed md:inset-y-0 duration-200`}
      >
        <div className="flex flex-col flex-grow border-r
          border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 pt-2">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
              alt="Workflow"
            />
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() =>setShowSiderbar(false)}
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block px-6 py-2.5 ml-7"
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample"
                aria-expanded="false" aria-controls="collapseExample"
              ><ChevronLeftIcon className="h-6 w-6 "/></button>
            </div>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2
              space-y-1 bg-white" aria-label="Sidebar">
              {navigation.map((item) =>
            !item.children ? (
              <div key={item.name}>
                <a
                  href="#"
                  className={classNames(
                    item.current ?
                      'bg-gray-100 text-gray-900' :
                      'bg-white text-gray-600',
                    'hover:bg-gray-50 hover:text-gray-900',
                    'group w-full flex items-center',
                    'pl-2 py-2 text-sm font-medium rounded-md',
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current ?
                      'text-gray-500' :
                      'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6',
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({open}) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current ?
                          'bg-gray-100 text-gray-900' :
                          'bg-white text-gray-600',
                        'hover:bg-gray-50 hover:text-gray-900',
                        'group w-full flex items-center',
                        'pl-2 pr-1 py-2 text-left',
                        'text-sm font-medium rounded-md',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                      )}
                    >
                      <item.icon
                        className="mr-3 flex-shrink-0 h-6 w-6
                         text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      <svg
                        className={classNames(
                          open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                          'ml-3 flex-shrink-0 h-5 w-5 transform',
                          'group-hover:text-gray-400',
                          'transition-colors ease-in-out duration-150',
                        )}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children.map((subItem) => (
                        <Disclosure.Button
                          key={subItem.name}
                          as="a"
                          href={subItem.href}
                          className="group w-full flex
                          items-center pl-11 pr-2 py-2
                          text-sm font-medium text-gray-600
                           rounded-md hover:text-gray-900 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ),
              )}
            </nav>
          </div>
        </div>
      </div>
      <div
        className={` ${
          showSidebar ? 'md:pl-64' : 'pl-0 '
        } flex flex-col flex-1 h-full`}
      >
        <div className="sticky ml-1 top-0 z-10
          flex-shrink-0 flex h-12 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200
              text-gray-500 focus:outline-none
               focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-0 flex justify-between h-12">
            { !showSidebar && <button
              onClick={() =>setShowSiderbar(true)}
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-6
                border
                py-2.5 h-12  text-black font-medium
                 text-xs leading-tight uppercase
                 rounded hover:bg-blue-700
                 hover:shadow-lg focus:bg-blue-700
                 focus:shadow-lg focus:outline-none
                 focus:ring-0 active:bg-blue-800
                 active:shadow-lg transition
                 duration-150 ease-in-out hidden md:flex"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            ><ChevronRightIcon className="h-6 w-6 "/></button>}
            <div className="flex-1 flex">
              <form className="w-full flex md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                    Search
                </label>
                <div className="relative w-full
                  text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0
                    left-0 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8
                      pr-3 py-2 border-transparent
                      text-gray-900 placeholder-gray-500
                      focus:outline-none
                      focus:placeholder-gray-400
                      focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
