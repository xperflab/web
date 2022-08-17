/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* This example requires Tailwind CSS v2.0+ */
import {useEffect, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {
  MoonIcon, SunIcon,
} from '@heroicons/react/outline';

function DarkModeButton(props) {
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
      props.ViewStore.setThemeDark();
      // setTheme('dark');
    } else {
      props.ViewStore.setThemeLight();
      // setTheme('light');
    }
  }, []);
  useEffect(() =>{
    if (props.ViewStore.theme ==='dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
  const handleThemeSwitch =()=> {
    if (props.ViewStore.theme === 'dark') {
      props.ViewStore.setThemeLight();
    } else {
      props.ViewStore.setThemeDark();
    }
    // setTheme(theme === 'dark'? 'light' : 'dark');
  };
  return (
    <>
      <button type='button' onClick={handleThemeSwitch} className ="dark:bg-[#1E1D2B]  pr-2">
        {props.ViewStore.theme === 'dark' ? <MoonIcon className="h-6 w-6
                     text-[#B73793] bg-[#1E1D2B]  " aria-hidden="true" /> : <SunIcon className="h-6 w-6
                     text-[#B73793]" aria-hidden="true" /> }
      </button>
    </>
  );
}
export default inject('ViewStore',
)(observer(DarkModeButton));
