import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import "../pages-css/sidebar.css"
import { Layout, Menu, Icon } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  FundViewOutlined,
  FundOutlined,
  TableOutlined,
  ExclamationCircleOutlined,
  ProfileOutlined
} from "@ant-design/icons";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
export default class sidebar extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    collapsed: false,
    showCurrentProfile: this.props.showCurrentProfile,
    selectKey: "1"
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
    window.postMessage(
      {
          type: "Flamegraph resize",
          data: ""
      }
  );
  };
  openExampleProfile = () => {
    fetch('example.ezview')
      .then(e => e.arrayBuffer())
      .then(binaryStr => {
        let result = window.decodeProfile(binaryStr, "0")
        console.log(result)
        if (result == 0) {
          let jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')()
          console.log(jsonStr)
          let fileExistList = JSON.parse(jsonStr)
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
          //window.navigate("/flame_graph");  
          this.props.changeComponentToFlamegraph()
          this.props.changeShowCurrentProfile()
          this.setState({ selectKey: '3' })
        }
      })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.showCurrentProfile != this.props.showCurrentProfile) {
      this.setState({ showCurrentProfile: this.props.showCurrentProfile })
    }

  }
  onClick = (e) => {
    this.setState({ selectKey: e.key })
  }
  render() {
    let renderComponent;
    if (this.state.collapsed === false) {
      renderComponent = ( <img src="/easyview2.png" style={{height:40,width:150}}></img>)
    } else  {
      renderComponent = ( <img src="/new_logo.png" style={{height:48,width:48}}></img>)
    }
    return (

      <Sider style={{ minHeight: '100vh' }} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
        <div >
        <div className="logo"style={{display:'inline-block'}} >
      {renderComponent}
       
        </div>
       </div>
        {/* <span style={color}>Easy View</span> */}
        <Menu theme="dark"  mode="inline" onClick={this.onClick} selectedKeys={[this.state.selectKey]}    defaultOpenKeys={['sub1']}>

          <Menu.Item key="1" onClick={() => {

            this.props.changeComponentToDropzone();
          }}>
            {/* <Icon type="pie-chart" /> */}
            <FileOutlined />

            <span>Open File</span>
          </Menu.Item>
          {this.state.showCurrentProfile && <SubMenu
            key="sub1"
            title={
              <span>
                {/* <Icon type="user" /> */}

                <FundOutlined />

                <span>Current Profile</span>
              </span>
            }
          >
            <Menu.Item key="3" onClick={() => { this.props.changeComponentToFlamegraph() }}><ExclamationCircleOutlined /> Flame Graph</Menu.Item>
            <Menu.Item key="4" onClick={() => { this.props.changeComponentToTreetable() }} ><TableOutlined />Tree Table</Menu.Item>
          </SubMenu>}

          <Menu.Item key="9" onClick={() => { this.props.changeComponentToVR() }}>
            {/* <Icon type="file" /> */}
            <FundViewOutlined />
            <span>VR Trace</span>
          </Menu.Item>
          <Menu.Item key="10" onClick={() => { this.openExampleProfile() }}>
            {/* <Icon type="file" /> */}
            <ProfileOutlined />
            <span>Example Profile</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
// /* This example requires Tailwind CSS v2.0+ */
// import { Disclosure } from '@headlessui/react'
// import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
// import { Component } from 'react';
// import { Link } from 'react-router-dom';

// const navigation = [
//   //   { name: 'Dashboard', icon: HomeIcon, current: true, href: '#' },
//   //   {
//   //     name: 'Team',
//   //     icon: UsersIcon,
//   //     current: false,
//   //     children: [
//   //       { name: 'Overview', href: '#' },
//   //       { name: 'Members', href: '#' },
//   //       { name: 'Calendar', href: '#' },
//   //       { name: 'Settings', href: '#' },
//   //     ],
//   //   },
//   {
//     name: 'Open file',
//     icon: FolderIcon,
//     current: false,
//     href: '/open_file'
//   },
//   {
//     name: 'Current profile',
//     icon: CalendarIcon,
//     current: false,
//     children: [
//       { name: 'Flame graph', href: '#' },
//       { name: 'Feature2', href: '#' },
//       { name: 'Feature3', href: '#' },
//       { name: 'Feature4', href: '#' },
//     ],
//   },
//   {
//     name: 'Example profile',
//     icon: InboxIcon,
//     current: false,

//   },
// ]


// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }


// export default class Sidebar extends Component {
//   constructor(props) {
//     super(props)
//   }


//   render() {

//     return (
//       <div className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0">
//         <div className="flex-1 flex flex-col min-h-0">
//           <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
//             <img
//               className="h-8 w-auto"
//               src="https://tailwindui.com/img/logos/workflow-logo-rose-500-mark-white-text.svg"
//               alt="Workflow"
//             />
//           </div>
//           <div className="flex-1 flex flex-col overflow-y-auto bg-gray-800">
//             <nav className="flex-1 px-2 space-y-1 bg-gray-700" aria-label="Sidebar">
//               {navigation.map((item) =>
//                 !item.children ? (
//                   <div key={item.name}>
//                     < div onClick={() => {
//                       {/* 这里给子组件 调用父组件方法  setPare */ }
//                       this.props.changeComponentToDropzone();
//                       //   this.props.setPare('我要传递给父组件');
//                     }}
//                       className={classNames(

//                         item.current ? 'bg-gray-900 text-white' : 'text-white hover:text-gray-900 hover:bg-gray-50',
//                         'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
//                       )}
//                     >
// //                       <item.icon
//                         className={classNames(
//                           item.current ? 'text-white' : 'text-white group-hover:text-gray-900',
//                           'mr-4 flex-shrink-0 h-6 w-6'
//                         )}
//                         aria-hidden="true"
//                       />
//                       {item.name}
//                     </div>
//                   </div>
//                 ) : (
//                   <Disclosure as="div" key={item.name} className="space-y-1">
//                     {({ open }) => (

//                       <>
//                         <Disclosure.Button
//                           className={classNames(
//                             item.current ? 'bg-gray-900 text-white' : 'text-white hover:text-gray-900 hover:bg-gray-50',
//                             'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
//                           )}
//                         >
//                           <item.icon
//                             className={classNames(
//                               item.current ? 'text-white' : 'text-white group-hover:text-gray-900 ',
//                               'mr-4 flex-shrink-0 h-6 w-6'
//                             )}
//                             aria-hidden="false"
//                           />
//                           <span className="flex-1">{item.name}</span>
//                           <svg
//                             className={classNames(
//                               open ? 'text-white rotate-90' : 'text-white',
//                               'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-900 transition-colors ease-in-out duration-150'
//                             )}
//                             viewBox="0 0 20 20"
//                             aria-hidden="false"
//                           >
//                             <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
//                           </svg>
//                         </Disclosure.Button>
//                         <Disclosure.Panel className="space-y-1">
//                           <div onClick={() => {

//                             this.props.changeComponentToFlamegraph();
//                             //   this.props.setPare('我要传递给父组件');
//                           }} className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:text-gray-900 hover:bg-gray-50">
//                             <Disclosure.Button>  FlameGraph</Disclosure.Button>    </div>

//                           <div onClick={() => {
//                             this.props.changeComponentToVR();

//                           }} className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:text-gray-900 hover:bg-gray-50">
//                             VR   </div>


//                           <div onClick={() => {
//                             this.props.changeComponentToTreetable();

//                           }} className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:text-gray-900 hover:bg-gray-50">
//                             Treetable   </div>

//                         </Disclosure.Panel>
//                       </>
//                     )}
//                   </Disclosure>
//                 )
//               )}
//             </nav>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }
