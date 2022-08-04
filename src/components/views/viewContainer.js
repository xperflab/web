/* eslint-disable react/prop-types */
import {React} from 'react';
import {
  ChevronRightIcon, MenuAlt2Icon,
} from '@heroicons/react/outline';
import {SearchIcon} from '@heroicons/react/solid';
import {inject, observer} from 'mobx-react';
import {Component} from 'react';
import Homeview from './homeview';
import {PropTypes} from 'prop-types';
import TreetableDataProcess from './treetableDataProcess';
/**
 *  inject('BarStore, ViewStore')
 * @class ViewContainer
 */
class ViewContainer extends Component {
  /**
     *
     * @param {object} props
     */
  constructor(props) {
    console.log(props);
    super(props);
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    let renderComponent;
    if (this.props.ViewStore.currentComponent === 'homeview') {
      renderComponent = (<Homeview/>);
    } else if (this.props.ViewStore.currentComponent === 'flamegraph') {
      renderComponent = (<div></div>);
    } else if (this.props.ViewStore.currentComponent === 'treetable') {
      renderComponent = (<TreetableDataProcess key=
        {this.props.ProfileStore.ProfileId}/>);
    } else if (this.props.ViewStore.currentComponent === 'vrtrace') {
      renderComponent = ( <div></div>);
    }
    return (
      <div
        className={` ${
      this.props.BarStore.showSidebar ? 'md:pl-[14.8rem]' : 'pl-0 '
        } flex flex-col flex-1 h-full`}
      >
        <div className="sticky ml-1 top-0 z-10
      flex-shrink-0 flex h-12 bg-gray-100 shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200
          text-gray-500 focus:outline-none
           focus:ring-2 focus:ring-inset
           focus:ring-indigo-500 md:hidden"
            onClick={() =>
              this.props.BarStore.setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-0 flex items-center justify-between h-12">
            { !this.props.BarStore.showSidebar && <button
              onClick={() =>this.props.BarStore.setShowSidebar(true)}
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-6
            border
            py-2.5 h-12  mt-[-0.1rem] ml-[-0.2rem] h-[3.2rem]
              text-black font-medium
             text-xs leading-tight uppercase
             rounded hover:bg-blue-700
             hover:shadow-lg focus:bg-blue-700
             focus:shadow-lg focus:outline-none
             focus:ring-0 active:bg-blue-800
             active:shadow-lg transition
             duration-150 ease-in-out hidden md:flex"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            ><ChevronRightIcon className="h-6 w-6 "/></button>}
            <div className="flex-1 flex justify-center  h-4/7  ">

              <form className="w-1/2 flex md:ml-0 bg-white "
                action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                Search
                </label>
                <div className="flex relative w-full
              text-gray-400 focus-within:text-gray-600 ">
                  <div className="absolute inset-y-0
                left-0 flex items-center pointer-events-none p-1 w-7">
                    <SearchIcon className="h-5 w-5"
                      aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8
                  pr-3 py-2 border-transparent
                  text-gray-900 placeholder-gray-500
                  focus:outline-none
                  focus:placeholder-gray-400
                  focus:ring-0 focus:border-transparent
                  sm:text-sm cursor-not-allowed
                  shadow-inner"
                    placeholder="Search"
                    type="search"
                    name="search"
                    disabled
                  />
                </div>
              </form>

            </div>
          </div>
        </div>
        {
          renderComponent
        }
      </div>
    );
  }
}
ViewContainer.propTypes = {
  BarStore: PropTypes.object.isRequired,
};
export default inject('BarStore', 'ViewStore', 'ProfileStore',
)(observer(ViewContainer));