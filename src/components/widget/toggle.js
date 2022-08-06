/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* This example requires Tailwind CSS v2.0+ */
import {useEffect, useState} from 'react';
import {
  MoonIcon, SunIcon,
} from '@heroicons/react/outline';


export default function Toggle() {
  const [enabled, setEnabled] = useState(false);
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);
  useEffect(() =>{
    if (theme ==='dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
  const handleThemeSwitch =()=> {
    setEnabled(!enabled);
    setTheme(theme === 'dark'? 'light' : 'dark');
  };
  return (
    <>
      <button type='button' onClick={handleThemeSwitch} className ="dark:bg-slate-900 pr-2">
        {theme === 'dark' ? <MoonIcon className="h-6 w-6
                     text-[#B73793] bg-slate-900" aria-hidden="true" /> : <SunIcon className="h-6 w-6
                     text-[#B73793]" aria-hidden="true" /> }
      </button>
    </>
  );
}
