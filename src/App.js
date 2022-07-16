/**
 * eslint require
 */
import {React} from 'react';

import {Provider, observer} from 'mobx-react';
import {BarStore} from './components/stores';
import LeftBar from './components/bars/leftBar';
import ViewContainer from './components/views/viewContainer';
import OpenFileDropezone from './components/utils/openFileDropzone';
const stores = {BarStore};


const App = observer(() => {
  return (
    <Provider {...stores}>
      <div className="h-full">
        <LeftBar/>
        <ViewContainer/>
        <OpenFileDropezone/>
      </div>
    </Provider>
  );
});

export default App;
