/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
/**
 * eslint require
 */
import {React, Component, useRef, lastActionRef} from 'react';

import {Provider, observer} from 'mobx-react';
import {BarStore, ViewStore, ProfileStore, TreetableStore,
} from './components/stores';
import LeftBar from './components/bars/leftBar';
import ViewContainer from './components/views/viewContainer';
import OpenFileDropezone from './components/utils/openFileDropzone';
const stores = {BarStore, ViewStore, ProfileStore, TreetableStore};


const App = ({onDragEnter, onDragOver, onDragLeave, onDrop}) => {
  const countRef = useRef(0);

  const onFileDrop = (e) => {
    if (e.type === 'drop') {
      console.log('drop');
      countRef.current++;
      ProfileStore.setIsDragOver(false);
      onDrop?.(e);
    }
    if (e.type === 'dragover') {
      console.log('dragover');
      if (!ProfileStore.isDragOver) {
        ProfileStore.setIsDragOver(true);
      }
      onDragOver?.(e);
    }
    if (e.type === 'dragenter') {
      console.log('dragenter');
      countRef.current++;
      if (countRef.current % 2) {
        ProfileStore.setIsDragOver(true);
        onDragEnter?.(e);
      }
    }
    if (e.type === 'dragleave') {
      console.log('dragleave');
      countRef.current++;
      if (!(countRef.current % 2)) {
        ProfileStore.setIsDragOver(false);
        onDragLeave?.(e);
        countRef.current = 0;
      }
    }
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
