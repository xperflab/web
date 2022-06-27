/* eslint-disable no-unused-vars */
import React, {Component, useState, useEffect} from 'react';
import {useCallback} from 'react';
import Sidebar from './components/sidebar';
import {useDropzone} from 'react-dropzone';
import FlameGraph from './components/flame_graph';
import Treetable from './pages/treetable';
import {InboxOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import VR from './components/vr';
import PropTypes from 'prop-types';
import {
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  UsersIcon,
  XIcon,
  SearchIcon,
} from '@heroicons/react/outline';
/**
 *
 * @param {*} props
 * @return {DropZone}
 */
function MyDropzone(props) {
  MyDropzone.propTypes = {
    changeComponentToFlamegraph: PropTypes.func,
    changeShowCurrentProfile: PropTypes.func,
  };
  const [loading, setLoading] = useState(false);
  const {changeComponentToFlamegraph, changeShowCurrentProfile} = props;
  //   onDrop(e) {
  //     console.log("Dropped files", e.dataTransfer);
  //   }
  useEffect(() => {
    console.log(loading);
  }, [loading]);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        setLoading(true);

        const binaryStr = reader.result;
        console.log(binaryStr);
        const result = window.decodeProfile(binaryStr, file.type);
        console.log(result);
        if (result == 0) { // decode success
          const jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')();
          console.log(jsonStr);
          const fileExistList = JSON.parse(jsonStr);
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
          changeComponentToFlamegraph(); // after decode success, switch the page to the Flame Graph
          changeShowCurrentProfile(); // after decode success, switch the sidebar to show current profile
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
  });

  return (

    <div>

      <div {...getRootProps()}>
        {loading ? <Spin> <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-8 sm:px-0">

              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column',
              }}>
                <input {...getInputProps()} />
                <p >
                  <InboxOutlined style={{color: '#B73C93', fontSize: 106}} />
                </p><br />
                <div style={{fontSize: 26, color: '#262626'}}>Click or drag file to this area to decode</div>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main> </Spin> : <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-8 sm:px-0">

              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column',
              }}>
                <input {...getInputProps()} />
                <p >
                  <InboxOutlined style={{color: '#B73C93', fontSize: 106}} />
                </p><br />
                <div style={{fontSize: 26, color: '#262626'}}>Click or drag file to this area to decode</div>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>}

      </div>
    </div>
  );
}
/**
 *The main component control switches different pages and components.
 */
class App extends Component {
  /**
   * The default page is dropzone.
   * The default sidebar doesn't show the current profile.
   */
  constructor() {
    super();
    this.state = {
      showComponent: 'dropzone',
      showCurrentProfile: false,
    };
  }

  /**
   * switch page to current profile and sidebar show current profile
   */
  changeShowCurrentProfile = () => {
    console.log('changetotrue');
    this.setState({
      showCurrentProfile: true,
    });
  };
  /**
   * switch page to flame graph
   */
  changeComponentToFlamegraph = () => {
    this.setState({
      showComponent: 'flamegraph',
    });
  };
  /**
   * switch page to dropzone
   */
  changeComponentToDropzone = () => {
    this.setState({
      showComponent: 'dropzone',
    });
  };
  /**
   * switch page to VR Trace
   */
  changeComponentToVR = () => {
    this.setState({
      showComponent: 'VR',
    });
  };
  /**
   * switch page to treetable
   */
  changeComponentToTreetable = () => {
    this.setState({
      showComponent: 'treetable',
    });
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    let renderComponent;
    if (this.state.showComponent === 'dropzone') {
      renderComponent = (<MyDropzone changeComponentToFlamegraph={this.changeComponentToFlamegraph} changeShowCurrentProfile={this.changeShowCurrentProfile} />);
    } else if (this.state.showComponent === 'flamegraph') {
      renderComponent = (<FlameGraph isShow={true} />);
    } else if (this.state.showComponent === 'VR') {
      renderComponent = (<VR/>);
    } else if (this.state.showComponent === 'treetable') {
      renderComponent = (<Treetable />);
    }
    return (
      <div>
        <Sidebar changeComponentToDropzone={this.changeComponentToDropzone}
          changeComponentToVR={this.changeComponentToVR}
          changeComponentToFlamegraph={this.changeComponentToFlamegraph}
          changeComponentToTreetable={this.changeComponentToTreetable}
          showCurrentProfile={this.state.showCurrentProfile}
          changeShowCurrentProfile={this.changeShowCurrentProfile}
        />

        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">

              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="h-screen flex-1 p-7">
              {
                renderComponent
              }
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
