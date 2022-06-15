import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';
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
  componentDidMount(){
    window.addEventListener("message", (event) => {
      const message = event.data; // The json data that the extension sent
      console.log(message)
   
      switch (message.type) {
        case "Select Flamegraph": {
          console.log(this)
          this.setState({ selectKey: '3' })
        }
 
   
      }
    }
    )
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
      renderComponent = ( <img src="/new_logo.png" style={{height:40,width:40}}></img>)
    }
    return (

      <Sider style={{ minHeight: '100vh', color:"#111827" }} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
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
      
            <FileOutlined   />
     
            <span >Open File</span>
          
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
            <Menu.Item key="3" onClick={() => { this.props.changeComponentToFlamegraph() }}><ExclamationCircleOutlined />Flame Graph</Menu.Item>
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