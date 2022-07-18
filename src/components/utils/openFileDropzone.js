/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * eslint require
 */
import {React} from 'react';

import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
// eslint-disable-next-line no-unused-vars
function decodeProfile(buffer, mime) {
  let data = new Uint8Array(buffer);
  let len = data.length;
  if (mime == 'application/gzip') {
    data = pako.ungzip(data);
    len = data.length;
    const newBuf = window.Module._malloc(data.length);
    window.Module.HEAPU8.set(data, newBuf);
    const result = window.Module._decode(newBuf, len);
    return result;
  } else {
    let newBuf = window.Module._malloc(data.length);
    Module.HEAPU8.set(data, newBuf);
    let result =window.Module._decode(newBuf, len);
    if (result == 1) {
      try {
        data = pako.ungzip(data);
        len = data.length;
        newBuf = window.Module._malloc(data.length);
        Module.HEAPU8.set(data, newBuf);
        result = window.Module._decode(newBuf, len);
      } catch (error) {
        return 1;
      }
    }
    return result;
  }
}

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
        const result = decodeProfile(binaryStr, file.type);
        console.log(result);
        if (result == 0) {
          const jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')();
          console.log(jsonStr);
          const fileExistList = JSON.parse(jsonStr);
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
          // changeComponentToFlamegraph();
          // changeShowCurrentProfile();
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true});
  return (
    // <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden  z-40 pointer-events-none active:pointer-events-auto"
    <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden  z-40"
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


