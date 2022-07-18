/* eslint-disable max-len */
/**
 * eslint require
 */
import {React} from 'react';

import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

/**
  * Top layer mask
  * @return {OpenFileDropezone}
  */
export default function OpenFileDropezone() {
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
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true});
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden  z-40 pointer-events-none active:pointer-events-auto"
      {...getRootProps()}>
      <input {...getInputProps()} />
      {
  isDragActive ?
    <div className="h-full w-full border-dashed border-8 bg-black opacity-20"></div>:
    <div className="h-full w-full"></div>
      }
    </div>
  );
}


