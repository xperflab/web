/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
/**
 * eslint require
 */
import {React, Component, useRef, useEffect, useState} from 'react';

import {Provider, observer} from 'mobx-react';
import {BarStore, ViewStore, ProfileStore, TreetableStore,
  DragStore, FlameGraphStore,
} from './components/stores';
import LeftBar from './components/bars/leftBar';
import ViewContainer from './components/views/viewContainer';
import OpenFileDropezone from './components/utils/openFileDropzone';
const stores = {BarStore, ViewStore, ProfileStore, TreetableStore,
  DragStore, FlameGraphStore};
const App = ({onDragEnter, onDragOver, onDragLeave, onDrop}) => {
  const countRef = useRef(0);
  // useEffect(() => {
  //   const head = document.getElementById('head');
  //   const link = document.createElement('link');

  //   link.type = 'text/css';
  //   link.rel = 'stylesheet';
  //   link.href = stylePath;

  //   head.appendChild(link);

  //   return () => {
  //     head.removeChild(link);
  //   };
  // }, [stylePath]);

  const onFileDrop = (e) => {
    DragStore.handleDragEvent(e, countRef,
        onDragEnter, onDragOver, onDragLeave, onDrop);
  };
  return (
    <Provider {...stores}>
      <div className="w-full h-full" onDrop={onFileDrop}
        onDragOver={onFileDrop}
        onDragEnter={onFileDrop}
        onDragLeave={onFileDrop}>
        <OpenFileDropezone/>
        <LeftBar/>
        <ViewContainer/>
      </div>
    </Provider>

  );
};

export default observer(App);
