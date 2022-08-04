/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
/**
 * eslint require
 */
import {React, Component, useRef, lastActionRef} from 'react';

import {Provider, observer} from 'mobx-react';
import {BarStore, ViewStore, ProfileStore, TreetableStore, DragStore,
} from './components/stores';
import LeftBar from './components/bars/leftBar';
import ViewContainer from './components/views/viewContainer';
import OpenFileDropezone from './components/utils/openFileDropzone';
const stores = {BarStore, ViewStore, ProfileStore, TreetableStore, DragStore};
const App = ({onDragEnter, onDragOver, onDragLeave, onDrop}) => {
  const countRef = useRef(0);

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
