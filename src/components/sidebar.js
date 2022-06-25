import {Disclosure} from '@headlessui/react';
import {CalendarIcon, InboxIcon} from '@heroicons/react/outline';
import {Component, React} from 'react';
import {BsChevronCompactLeft} from 'react-icons/bs';
import PropTypes from 'prop-types';
/**
 *
 * @param  {...any} classes
 * @return {FIXME}
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * current VR trace and current Profile only one appears at the same time
 */
export default class Sidebar extends Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    Sidebar.propTypes = {
      changeComponentToFlamegraph: PropTypes.func,
      changeComponentToDropzone: PropTypes.func,
    };
    this.state ={
      collapse: false,
      navigation: [
        {
          name: 'Current Profile',
          icon: CalendarIcon,
          current: false,
          show: false,
          children: [
            // { name: 'Flame Graph', href: this.props.changeComponentToFlamegraph()},
            {name: 'Flame Graph', href: this.props.changeComponentToFlamegraph()},
            {name: 'Tree Table', href: ''},
          ],
        },
        {
          name: 'Current VR Trace',
          icon: InboxIcon,
          current: false,
          show: false,
        },

        {
          name: 'Profile',
          icon: CalendarIcon,
          current: false,
          show: true,
          children: [
            {name: 'Open File', href: this.props.changeComponentToDropzone()},
            {name: 'Example Profile', href: '#'},
          ],
        },
        {
          name: 'VR Trace',
          icon: InboxIcon,
          current: false,
          show: true,
          children: [
            {name: 'Example VR Trace', href: '#'},
          ],
        },
      ],
    };
  }


  // eslint-disable-next-line require-jsdoc
  render() {
    return (

      <div
        className={` ${
          this.state.collapse ? 'w-20' : 'w-70'
        } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
      >
        <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto h-full">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
              alt="Workflow"
            />
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1 bg-white" aria-label="Sidebar">
              {this.state.navigation.map((item) => item.show &&(
              !item.children ? (
                <div key={item.name}>
                  <a
                    href="#"
                    className={classNames(
                      item.current ?
                        'bg-gray-100 text-gray-900' :
                        'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md',
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6',
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </div>
              ) : (
                <Disclosure as="div" key={item.name} className="space-y-1">
                  {({open}) => (
                    <>
                      <Disclosure.Button
                        className={classNames(
                          item.current ?
                            'bg-gray-100 text-gray-900' :
                            'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                        )}
                      >
                        <item.icon
                          className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="flex-1">{item.name}</span>
                        <svg
                          className={classNames(
                            open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                            'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150',
                          )}
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                        </svg>
                      </Disclosure.Button>
                      <Disclosure.Panel className="space-y-1">
                        {item.children.map((subItem) => (
                          <Disclosure.Button
                            key={subItem.name}
                            as="a"
                            onClick={subItem.href}
                            className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                          >
                            {subItem.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )

              ))}
            </nav>
          </div>
        </div>
        <BsChevronCompactLeft onClick={() =>{
          this.setState({collapse: !this.state.collapse});
        }} />
      </div>

    );
  }
}
