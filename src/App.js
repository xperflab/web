/**
 * eslint require
 */
import {React} from 'react';

import {Component, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import Bars from './components/bars';
import Homepage from './pages/homepage';
/**
 * Top layer
 * Include sidebar and dropzone. If the screen width is
 * less than 768px will trigger the responsive design.
 * @return {DragOpenFileLayerDropzone}
 */
function DragOpenFileLayerDropzone() {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps} = useDropzone({onDrop, noClick: true});
  return (
    <div className="h-full"{...getRootProps()}>
      <input {...getInputProps()} />
      <Bars/>
      <Homepage/>
    </div>
  );
}
/**
 *The main component.
 */
export default class App extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <DragOpenFileLayerDropzone/>
    );
  }
}

