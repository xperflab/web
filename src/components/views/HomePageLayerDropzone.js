/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {React, Component} from 'react';
import {
  InboxIcon,
} from '@heroicons/react/outline';
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {inject, observer} from 'mobx-react';

function HomePageLayerDropzone(props) {
  console.log(props);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        const result = props.ProfileStore.decodeProfile(binaryStr, file.type);
        if (result == 0) {
          const jsonStr =
          window.Module.cwrap('getSourceFileJsonStr', 'string')();
          const fileExistList = JSON.parse(jsonStr);
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
          props.TreetableStore.columns.clear();
          props.BarStore.setShowCurrentProfile(true);
          props.ViewStore.setCurrentFlameGraph();
          props.ProfileStore.incrementProfileKey();
          props.FlameGraphStore.incrementFlamegraphId();
          props.FlameGraphStore.setDataShowType(0);
          props.FlameGraphStore.setMetricIndex(0);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps} =
  useDropzone({onDrop, noDrop: true});
  return (
    <div className="collapse bg-[#F3F4F6]
    dark:shadow-[inset_0px_-2px_2px_0px_rgba(255,255,255,1)]
    shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.1)]
    dark:border-b-[#414357]"
    enter="ease-in-out " id="collapseExample" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="block dark:bg-[#272938]">
        <div>
          {/* Replace with your content */}
          <div className="max-w-7xl mx-auto" >

            <div className="px-4 py-5 sm:px-0">

              <div className="   border-dashed border-gray-200
                rounded-lg h-40" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column',
              }}>
                <InboxIcon className="text-[#B73C93]"/>
                <div className ="text-[#262626] text-2xl dark:text-slate-400">
                    Click or drag file to this area to decode</div>
              </div>
            </div>
          </div>
          {/* /End replace */}
        </div>
      </div>
    </div>


  );
}
export default inject('TreetableStore', 'BarStore', 'ViewStore',
    'ProfileStore')(observer(HomePageLayerDropzone));
