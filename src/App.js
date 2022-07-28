/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
/**
 * eslint require
 */
import {React, Component} from 'react';

import {Provider, observer} from 'mobx-react';
import {BarStore, ViewStore, ProfileStore, TreetableStore,
} from './components/stores';
import LeftBar from './components/bars/leftBar';
import ViewContainer from './components/views/viewContainer';
import OpenFileDropezone from './components/utils/openFileDropzone';
const stores = {BarStore, ViewStore, ProfileStore, TreetableStore};


class App extends Component {
  constructor() {
    super();
    this.state = {
    };
    this._onDragEnter = this._onDragEnter.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDrop = this._onDrop.bind(this);
  }
  componentDidMount() {
    console.log(ProfileStore);
    window.addEventListener('mouseup', this._onDragLeave);
    window.addEventListener('dragenter', this._onDragEnter);
    window.addEventListener('dragover', this._onDragOver);
    window.addEventListener('drop', this._onDrop);
    document.getElementById('root').addEventListener(
        'dragleave', this._onDragLeave);
  }
  componentWillUnmount() {
    window.removeEventListener('mouseup', this._onDragLeave);
    window.removeEventListener('dragenter', this._onDragEnter);
    window.removeEventListener('drop', this._onDrop);
    window.addEventListener('dragover', this._onDragOver);
    document.getElementById('root').removeEventListener(
        'dragleave', this._onDragLeave);
  }
  _onDragEnter(e) {
    console.log('dragenter');
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  _onDragOver(e) {
    console.log('dragover');
    e.preventDefault();
    e.stopPropagation();
    if (!ProfileStore.isDragOver) {
      ProfileStore.setIsDragOver(true);
    }
    return false;
  }

  _onDragLeave(e) {
    console.log('dragleave');
    e.stopPropagation();
    e.preventDefault();
    if (ProfileStore.isDragOver) {
      ProfileStore.setIsDragOver(false);
    }

    return false;
  }
  _onDrop(e) {
    console.log('drop');
    e.preventDefault();
    ProfileStore.setIsDragOver(false);
    return false;
  }


  render() {
    return (
      <Provider {...stores}>
        <div className="w-full h-full">
          <OpenFileDropezone/>
          <LeftBar/>
          <ViewContainer/>
        </div>
      </Provider>

    );
  }
}

export default observer(App);
