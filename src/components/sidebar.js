
// import React, { Component } from 'react'
// import { useState } from 'react'
// import{BsArrowLeftShort} from "react-icons/bs"

// export default function Sidebar() {
//  const [open, setOpen] = useState(true);

//   return (

//         <div className='bg-dark-purple h-screen p-5 pt-8 w-72'>Sidebar
//             <p>placeholder</p>

//         </div>
         
  
//   )
// }

// import { useState } from "react";
// import { BsChevronDown } from "react-icons/bs";
// const Sidebar = () => {
//   const [open, setOpen] = useState(true);
//   const [submenuOpen, setSubmenuOpen] = useState(false)
//   const Menus = [
//     { title: "Current Profile", 
//       src: "Chart_fill",
//       submenu: true,
//       submenuItems:[
//         {title:"Flame graph"},
//         {title:"Tree table"}
//       ]
//     },
//     { title: "Current VR Trace", 
//       src: "Chat",
    
//     },
//     { title: "Profile", src: "User", 
//       submenu: true,
//       submenuItems:[
//         {title:"Open File"},
//         {title:"Example Profile"}
//       ]},
//     { title: "VR Profile", src: "Calendar" ,
//     submenu: true,
//     submenuItems:[
//       {title:"Example VR Trace"},

//     ]
//    },
//   ];

//   return (
//     <div className="flex">
//       <div
//         className={` ${
//           open ? "w-72" : "w-20 "
//         } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
//       >
//         <img
//           src="./src/assets/control.png"
//           className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
//            border-2 rounded-full  ${!open && "rotate-180"}`}
//           onClick={() => setOpen(!open)}
//         />
//         <div className="flex gap-x-4 items-center">
//           <img
//             src="./src/assets/logo.png"
//             className={`cursor-pointer duration-500 ${
//               open && "rotate-[360deg]"
//             }`}
//           />
//           <h1
//             className={`text-white origin-left font-medium text-xl duration-200 ${
//               !open && "scale-0"
//             }`}
//           >
//             Designer
//           </h1>
//         </div>
//         <ul className="pt-6">
//           {Menus.map((Menu, index) => (
//             <>
//             <li
//               key={index}
//               className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
//               ${Menu.gap ? "mt-9" : "mt-2"} ${
//                 index === 0 && "bg-light-white"
//               } `}
//             >
//               <img src={`./src/assets/${Menu.src}.png`} />
//               <span className={`${!open && "hidden"} origin-left duration-200`}>
//                 {Menu.title}
//               </span>
//               {Menu.submenu && (<BsChevronDown className={'${submenuOpen && "rotate-180"}'} onClick={() =>{setSubmenuOpen(!submenuOpen)}}/>
//               )}
//             </li>
//             {Menu.submenu && (
//               <ul>
//                 {Menu.submenuItems.map((submenuItems, index) => (
//                   <li key = {index} className ="rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 ">
//                       {submenuItems.title}
//                   </li>

//                 ))}
//               </ul>
//             )}
//               </>
//           ))}
//         </ul>
//       </div>
//       <div className="h-screen flex-1 p-7">
//         <h1 className="text-2xl font-semibold ">Home Page</h1>
//       </div>
//     </div>
//   );
// };
// export default Sidebar;
import { Disclosure } from '@headlessui/react'
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
import { Component } from 'react';
import { BsChevronCompactLeft } from 'react-icons/bs';




export default class Sidebar extends Component {
  
  constructor(props) {
    super(props)
    this.state ={
      collapse:false
    }
  }


  render() {
    const navigation = [
      {
        name: 'Current Profile',
        icon: CalendarIcon,
        current: false,
        show: false,
        children: [
          { name: 'Flame Graph', href: '#' },
          { name: 'Tree Table', href: '#' },
        ],
      },
      {
        name: 'Current VR Trace',
        icon: InboxIcon,
        current: false,
        show: false,
      },
    
      {
        name: 'Profile',
        icon: CalendarIcon,
        current: false,
        show: true,
        children: [
          { name: 'Open File', href: '#'},
          { name: 'Example Profile', href: '#' },
        ],
      },
      {
        name: 'VR Trace',
        icon: InboxIcon,
        current: false,
        show: true,
        children: [
            { name: 'Example VR Trace', href: '#' },
          ],
      },
    ]
    
    
    function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
    }

    return (

        <div
        className={` ${
          this.state.collapse ? "w-20" : "w-70"
        } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
      >
        <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto h-full">
        <div className="flex items-center flex-shrink-0 px-4">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
            alt="Workflow"
          />
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1 bg-white" aria-label="Sidebar">
            {navigation.map((item) => item.show &&(
              !item.children ? (
                <div key={item.name}>
                  <a
                    href="#"
                    className={classNames(
                      item.current
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </div>
              ) : (
                <Disclosure as="div" key={item.name} className="space-y-1">
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={classNames(
                          item.current
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        )}
                      >
                        <item.icon
                          className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="flex-1">{item.name}</span>
                        <svg
                          className={classNames(
                            open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                            'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
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
                            onClick={subItem.href}
                            className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                          >
                            {subItem.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )
                        
            ))}
          </nav>
        </div>
      
       </div>
       <BsChevronCompactLeft onClick={() =>{this.setState({collapse : !this.state.collapse})}} />
       </div>
    
    )
  }
}