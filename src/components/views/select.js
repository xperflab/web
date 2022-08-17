import {React} from 'react';
import {Listbox} from '@headlessui/react';
import {CogIcon} from '@heroicons/react/outline';
import {CheckIcon} from '@heroicons/react/solid';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Component} from 'react';
import {PropTypes} from 'prop-types';
/**
  * Combine the className in if condition render
  * @param  {...any} classes
  * @return {String}
  */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * inject('TreetableStore')
 * Contorl the visibility of the column of the treetable
 * @param {e} e is the event of the click
 */
class Select extends Component {
  /**
   *
   * @param {props} props
   * isOpen: Contorl the visibility of the listbox
   */
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  handelChange = (e) =>{
    this.props.TreetableStore.updateSelect(e.dataIndex);
    console.log(toJS(this.props.TreetableStore));
    this.forceUpdate();
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="w-[7.4rem] pl-[0.2rem] ">
        <Listbox
          onChange={(event) => {
            console.log('enfant', event);
            this.handelChange(event);
          }}>
          {() => (
            <>
              <div className="mt-1 relative ">
                <Listbox.Button className="relative
                dark:bg-slate-600 dark:border-slate-600 w-[0.03rem]
                h-[1.9rem] bg-white border border-gray-300 rounded-md
                shadow-sm pl-3 pr-10 py-2 text-left cursor-default sm:text-sm"
                onClick={() => {
                  this.setState({isOpen: !this.state.isOpen});
                }}
                >
                  <span className="absolute inset-y-0 right-0 flex
                  items-center pr-4 pointer-events-none">
                    <CogIcon className="h-5 w-5
                     text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>


                {this.state.isOpen && (
                  <Listbox.Options static className="absolute z-10
                  mt-1 w-[25rem] dark:bg-slate-600
                  bg-white shadow-lg max-h-60 rounded-md py-1 text-base
                  ring-1 ring-black ring-opacity-5
                  overflow-auto focus:outline-none sm:text-sm">
                    { toJS(this.props.TreetableStore.columns)
                        .slice(1).map((person) => (
                          <Listbox.Option
                            key={person.dataIndex}
                            className={({active}) =>
                              classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
                              )
                            }
                            value={person}
                          >
                            {({selected, active}) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                              person.select ? 'bg-green-400' : 'bg-gray-200',
                              'flex-shrink-0 inline-block h-2 w-2 rounded-full',
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span
                                    className={classNames(selected ?
                                        'font-semibold' :
                                         'font-normal',
                                    'ml-3 block truncate dark:text-slate-400')}
                                  >
                                    {person.title}
                                    <span className="sr-only"> is
                                      {person.select ? 'select' :
                                      'offline'}</span>
                                  </span>
                                </div>

                                {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0',
                              'right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                  </Listbox.Options>
                )}

              </div>
            </>
          )}
        </Listbox>
      </div>
    );
  }
}
Select.propTypes = {
  TreetableStore: PropTypes.object.isRequired,
};
export default inject('TreetableStore')(observer(Select));
