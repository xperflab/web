/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';

/**
 * @param {value} value IsDragOver true or false.
 * @param {e} The event object.
 * @param {countRef}  keep a reference counter, increment it when you get a dragenter, decrement when you get a dragleave. When the counter is at 0 - remove the class. https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
 * @param {onDrop} onDrop event is fired when an
 * element or text selection is dropped on a valid drop target.
 * @param {ondragover} ondragover event is fired continuously when
 * an element or text selection is being dragged and the
 * mouse pointer is over a valid drop target (every 50 ms
 * WHEN mouse is not moving ELSE much faster between 5 ms
 *  (slow movement) and 1ms (fast movement) approximately.
 * This firing pattern is different than mouseover ).
 * @param {ondragenter} ondragenter is event is fired when a
 * dragged element or text selection enters a valid drop target.
 * @param {ondragleave} ondragleave event is fired when a
 * dragged element or text selection leaves a valid drop target.
 */
class DragStore {
  /**
   * Creating observable state
   */
  IsDragOver = false;
  /**
   * Creating observable state
   */
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

