import {React, Component} from 'react';
import {
  InboxIcon,
} from '@heroicons/react/outline';

/**
 *
 * https://react-dropzone.js.org/
 * @return {Dropzone}
 */
function HomePageLayerDropzone() {
  return (
    <div className="max-w-7xl mx-auto  ">
      <div className="px-4 py-5 sm:px-0">
        <div className="   border-dashed border-gray-200
                rounded-lg h-40" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column',
        }}>
          <InboxIcon className="text-[#B73C93]"/>
          <div className ="text-[#262626] text-2xl dark:text-slate-400">
                    Click or drag file to this area to decode</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Include the Logo and the dropzone.
 */
export default class Homeview extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="h-full">
        <div className="collapse bg-[#F3F4F6]"
          enter="ease-in-out " id="collapseExample">
          <div className="block dark:bg-slate-500">
            <div>
              {/* Replace with your content */}
              <HomePageLayerDropzone/>
              {/* /End replace */}
            </div>
          </div>
        </div>
        {/* Box-shadow generator to help anpms djust the effect
          https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Backgrounds_and_Borders/Box-shadow_generator */}
        <div className="shadow-[0_-1px_3px_-0px_rgba(0,0,0,0.1)]
        flex justify-center h-full">
          <div className="mt-40">
            <div className="text-7xl px-4 font-bold
              text-black dark:text-slate-200">
                Easy<span
                className="font-medium text-transparent
                   bg-clip-text bg-gradient-to-br
                   from-[#fe4ba1] to-[#4a247c]">View</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}
