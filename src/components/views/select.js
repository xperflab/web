/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* This example requires Tailwind CSS v2.0+ */
import {Fragment, useState, Component} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid';
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

class Select extends Component {
  constructor(props) {
    console.log(props);
    super(props);
  }
  handelChange = (e) =>{
    this.props.TreetableStore.updateSelect(e.dataIndex);
    // const updated = this.props.TreetableStore.columns.find((column) => column.dataIndex === e.dataIndex);
    // updated.select = !updated.select;
    console.log(toJS(this.props.TreetableStore));
  };
  render() {
    return (
      <Listbox
        onChange={(event) => {
          console.log('enfant', event);
          this.handelChange(event);
        }}>
        {({open}) => (
          <>
            <div className="mt-1 relative">
              <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <span className="flex items-center">
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  { toJS(this.props.TreetableStore.columns).slice(1).map((person) => (
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
                              className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                            >
                              {person.title}
                              <span className="sr-only"> is {person.select ? 'select' : 'offline'}</span>
                            </span>
                          </div>

                          {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
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
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    );
  }
}

export default inject('TreetableStore')(observer(Select));
