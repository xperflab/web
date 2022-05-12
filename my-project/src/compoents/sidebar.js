/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react'
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'

const navigation = [
//   { name: 'Dashboard', icon: HomeIcon, current: true, href: '#' },
//   {
//     name: 'Team',
//     icon: UsersIcon,
//     current: false,
//     children: [
//       { name: 'Overview', href: '#' },
//       { name: 'Members', href: '#' },
//       { name: 'Calendar', href: '#' },
//       { name: 'Settings', href: '#' },
//     ],
//   },
  {
    name: 'Open file',
    icon: FolderIcon,
    current: false,
    href:'#'
  },
  {
    name: 'Current profile',
    icon: CalendarIcon,
    current: false,
    children: [
      { name: 'Flame graph', href: '#' },
      { name: 'Feature2', href: '#' },
      { name: 'Feature3', href: '#' },
      { name: 'Feature4', href: '#' },
    ],
  },
  {
    name: 'Example profile',
    icon: InboxIcon,
    current: false,
    children: [
      { name: 'open example file', href: '#' },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  return (
    <div className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0">
    <div className="flex-1 flex flex-col min-h-0">
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
      <img
        className="h-8 w-auto"
        src="https://tailwindui.com/img/logos/workflow-logo-rose-500-mark-white-text.svg"
        alt="Workflow"
      />
    </div>
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-800">
        <nav className="flex-1 px-2 space-y-1 bg-gray-700" aria-label="Sidebar">
          {navigation.map((item) =>
            !item.children ? (
              <div key={item.name}>
                <a
                  href="#"
                  className={classNames(
        
                    item.current ? 'bg-gray-900 text-white' : 'text-white hover:text-gray-900 hover:bg-gray-50',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                        item.current ? 'text-white' : 'text-white group-hover:text-gray-900',
                        'mr-4 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({ open}) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-white hover:text-gray-900 hover:bg-gray-50',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                         className={classNames(
                            item.current ? 'text-white' : 'text-white group-hover:text-gray-900 ',
                            'mr-4 flex-shrink-0 h-6 w-6'
                          )}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      <svg
                        className={classNames(
                          open ? 'text-white rotate-90' : 'text-white',
                          'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-900 transition-colors ease-in-out duration-150'
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
                          href={subItem.href}
                          className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-white rounded-md hover:text-gray-900 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          )}
        </nav>
      </div>
    </div>
    </div>
  )
}
