/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react'
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
import { Component } from 'react';
import { Link } from 'react-router-dom';

const navigation = [
  //   { name: 'Dashboard', icon: HomeIcon, current: true, href: '#' },
  //   {
  //     name: 'Team',
  //     icon: UsersIcon,
  //     current: false,
  //     children: [
  //       { name: 'Overview', href: '#' },
  //       { name: 'Members', href: '#' },
  //       { name: 'Calendar', href: '#' },
  //       { name: 'Settings', href: '#' },
  //     ],
  //   },
  {
    name: 'Open file',
    icon: FolderIcon,
    current: false,
    href: '/open_file'
  },
  {
    name: 'Current profile',
    icon: CalendarIcon,
    current: false,
    children: [
      { name: 'Flame graph', href: '#' },
      { name: 'Feature2', href: '#' },
      { name: 'Feature3', href: '#' },
      { name: 'Feature4', href: '#' },
    ],
  },
  {
    name: 'Example profile',
    icon: InboxIcon,
    current: false,

  },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default class Sidebar extends Component {
  constructor(props) {
    super(props)
  }


  render() {

    return (
      <div className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-rose-500-mark-white-text.svg"
              alt="Workflow"
            />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto bg-gray-800">
            <nav className="flex-1 px-2 space-y-1 bg-gray-700" aria-label="Sidebar">
              {navigation.map((item) =>
                !item.children ? (
                  <div key={item.name}>
                    < div onClick={() => {
                      {/* 这里给子组件 调用父组件方法  setPare */ }
                      this.props.changeComponentToDropzone();
                      //   this.props.setPare('我要传递给父组件');
                    }}
                      className={classNames(

                        item.current ? 'bg-gray-900 text-white' : 'text-white hover:text-gray-900 hover:bg-gray-50',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current ? 'text-white' : 'text-white group-hover:text-gray-900',
                          'mr-4 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                  </div>
                ) : (
                  <Disclosure as="div" key={item.name} className="space-y-1">
                    {({ open }) => (

                      <>
                        <Disclosure.Button
                          className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-white hover:text-gray-900 hover:bg-gray-50',
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-white' : 'text-white group-hover:text-gray-900 ',
                              'mr-4 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="false"
                          />
                          <span className="flex-1">{item.name}</span>
                          <svg
                            className={classNames(
                              open ? 'text-white rotate-90' : 'text-white',
                              'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-900 transition-colors ease-in-out duration-150'
                            )}
                            viewBox="0 0 20 20"
                            aria-hidden="false"
                          >
                            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                          </svg>
                        </Disclosure.Button>
                        <Disclosure.Panel className="space-y-1">
                          <div onClick={() => {

                            this.props.changeComponentToFlamegraph();
                            //   this.props.setPare('我要传递给父组件');
                          }} className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:text-gray-900 hover:bg-gray-50">
                            <Disclosure.Button>  FlameGraph</Disclosure.Button>    </div>

                          <div onClick={() => {
                            this.props.changeComponentToVR();

                          }} className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:text-gray-900 hover:bg-gray-50">
                            VR   </div>


                          <div onClick={() => {
                            this.props.changeComponentToTreetable();

                          }} className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:text-gray-900 hover:bg-gray-50">
                            Treetable   </div>

                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )
              )}
            </nav>
          </div>
        </div>
      </div>
    )
  }
}