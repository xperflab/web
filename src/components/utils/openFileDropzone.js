/* eslint-disable react/prop-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * eslint require
 */
import {React} from 'react';
import {inject, observer} from 'mobx-react';
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
// eslint-disable-next-line no-unused-vars


/**
  * Top layer mask
  * @return {OpenFileDropezone}
  */
function OpenFileDropezone(props) {
  console.log(props);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        const result = props.ProfileStore.decodeProfile(binaryStr, file.type);
        if (result == 0) {
          const jsonStr = window.Module.cwrap('getSourceFileJsonStr', 'string')();
          const fileExistList = JSON.parse(jsonStr);
          for (let i = 0; i < fileExistList.length; i++) {
            window.Module._updateSourceFileExistStatus(i, fileExistList[i]);
          }
          props.TreetableStore.columns.clear();
          props.BarStore.setShowCurrentProfile(true);
          props.ViewStore.setCurrentTreeTable();
          props.ProfileStore.incrementProfileKey();
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true});
  return (


    <div className={` ${
      props.DragStore.IsDragOver ? '' : 'pointer-events-none'
    } absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden  z-40`}

    {...getRootProps()}>
      <input {...getInputProps()} />
      {
  isDragActive ?
    <div className="h-full w-full border-dashed border-[#E06C75] border-4 bg-gray-500 bg-opacity-20"></div>:
    <div className="h-full w-full"></div>
      }

    </div>
  );
}
export default inject('BarStore', 'ViewStore', 'ProfileStore', 'TreetableStore', 'DragStore')(observer(OpenFileDropezone));
