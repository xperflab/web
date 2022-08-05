/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* This example requires Tailwind CSS v2.0+ */
import {useEffect, useState} from 'react';
import {Switch} from '@headlessui/react';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

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
  const handleChange =()=> {
    setEnabled(!enabled);
    setTheme(theme === 'dark'? 'light' : 'dark');
  };
  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className={classNames(
        enabled ? 'bg-[#B73793]' : 'bg-gray-200',
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ',
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        )}
      />
    </Switch>
  );
}
