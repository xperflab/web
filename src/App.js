/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/**
 * eslint require
 */
import {React} from 'react';

import {useReducer} from 'react';
import LeftBar from './components/bars/leftBar';
import ViewContainer from './components/views/viewContainer';
import OpenFileDropezone from './components/utils/openFileDropzone';
import Provider from './components/utils/provide';
import {initialState as store, reducer} from './components/utils/store';

export default function App() {
  const [state, dispatch] = useReducer(reducer, store);
  /**
   * Click buttons to show the sidebar or hide the sidebar.
   * @param {boolean} value
   */

  // eslint-disable-next-line require-jsdoc

  return (
    <div className="h-full">
      <Provider store={{state, dispatch}}>
        <LeftBar />
        <ViewContainer/>
      </Provider>
      <OpenFileDropezone/>
    </div>
  );
}


