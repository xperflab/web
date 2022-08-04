/* eslint-disable require-jsdoc */
import {makeAutoObservable} from 'mobx';

class DragStore {
  /**
   * Creating observable state
   */
  IsDragOver = false;
  constructor() {
    makeAutoObservable(this);
  }
  setIsDragOver = (value) => {
    this.IsDragOver = value;
  };
  handleDragEvent = (e, countRef, onDragEnter, onDragOver,
      onDragLeave, onDrop) => {
    if (e.type === 'drop') {
      console.log('drop');
      console.log(typeof countRef);
      countRef.current++;
      this.setIsDragOver(false);
      onDrop?.(e);
    }
    if (e.type === 'dragover') {
      console.log('dragover');
      if (!this.isDragOver) {
        this.setIsDragOver(true);
      }
      onDragOver?.(e);
    }
    if (e.type === 'dragenter') {
      console.log('dragenter');
      countRef.current++;
      if (countRef.current % 2) {
        this.setIsDragOver(true);
        onDragEnter?.(e);
      }
    }
    if (e.type === 'dragleave') {
      console.log('dragleave');
      countRef.current++;
      if (!(countRef.current % 2)) {
        this.setIsDragOver(false);
        onDragLeave?.(e);
        countRef.current = 0;
      }
    }
  };
}
const dragStore = new DragStore();
export default dragStore;
