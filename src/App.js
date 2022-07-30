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


// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       count: 0,
//     };
//     this._onDragEnter = this._onDragEnter.bind(this);
//     this._onDragLeave = this._onDragLeave.bind(this);
//     this._onDragOver = this._onDragOver.bind(this);
//     this._onDrop = this._onDrop.bind(this);
//     const countRef =useRef(0);
//   }
//   componentDidMount() {
//     console.log(ProfileStore);
//     window.addEventListener('mouseup', this._onDragLeave);
//     window.addEventListener('dragenter', this._onDragEnter);
//     window.addEventListener('dragover', this._onDragOver);
//     window.addEventListener('drop', this._onDrop);
//     document.getElementById('root').addEventListener(
//         'dragleave', this._onDragLeave);
//   }
//   componentWillUnmount() {
//     window.removeEventListener('mouseup', this._onDragLeave);
//     window.removeEventListener('dragenter', this._onDragEnter);
//     window.removeEventListener('drop', this._onDrop);
//     window.addEventListener('dragover', this._onDragOver);
//     document.getElementById('root').removeEventListener(
//         'dragleave', this._onDragLeave);
//   }
//   _onDragEnter(e) {
//     if (this.state.count % 2 === 0) {
//       console.log('dragenter');
//       if (!ProfileStore.isDragOver) {
//         ProfileStore.setIsDragOver(true);
//       }
//       this.setState({count: this.state.count + 1});
//       e.stopPropagation();
//       e.preventDefault();
//       return false;
//     }
//   }

//   _onDragOver(e) {
//     console.log('dragover');
//     e.preventDefault();
//     e.stopPropagation();
//     if (!ProfileStore.isDragOver) {
//       ProfileStore.setIsDragOver(true);
//     }
//     return false;
//   }

//   _onDragLeave(e) {
//     if (this.state.count % 2 !== 0) {
//       console.log('dragleave');
//       e.stopPropagation();
//       e.preventDefault();
//       if (ProfileStore.isDragOver) {
//         ProfileStore.setIsDragOver(false);
//       }
//       this.setState({count: this.state.count - 1});
//       return false;
//     }
//   }
//   _onDrop(e) {
//     console.log('drop');
//     e.preventDefault();
//     ProfileStore.setIsDragOver(false);
//     return false;
//   }


//   render() {
//     return (
//       <Provider {...stores}>
//         <div className="w-full h-full">
//           <OpenFileDropezone/>
//           <LeftBar/>
//           <ViewContainer/>
//         </div>
//       </Provider>

//     );
//   }
// }
const App = ({onDragEnter, onDragOver, onDragLeave, onDrop}) => {
  const countRef = useRef(0);

  const onFileDrop = (e) => {
    if (e.type === 'drop') {
      console.log('drop');
      ProfileStore.setIsDragOver(false);
      onDrop?.(e);
    }
    if (e.type === 'dragover') {
      console.log('dragover');
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
