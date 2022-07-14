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
  console.log('App');


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
// /**
//  *
//  * @param { Component} value
//  */
// export default class App extends Component {
//   const stores = {BarStore};
//   // eslint-disable-next-line require-jsdoc
//   render() {
//     return (
//       <Provider {...stores}>
{/* <div className="h-full">
  <LeftBar sideState = {this.state.sideState}/>
  <ViewContainer sideState = {this.state.sideState}/>
  <OpenFileDropezone/>
</div>; */}
//       </Provider>
//     );
//   }
// }

