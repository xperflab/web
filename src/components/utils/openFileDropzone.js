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
  const {getRootProps, getInputProps} = useDropzone({onDrop, noClick: true});
  return (
    <div className="h-full"{...getRootProps()}>
      <input {...getInputProps()} />
    </div>
  );
}
