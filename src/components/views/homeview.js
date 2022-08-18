/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
/* eslint-disable react/prop-types */
import {React, Component} from 'react';
import HomePageLayerDropzone from './HomePageLayerDropzone';
/**
 *
 * https://react-dropzone.js.org/
 * @return {Dropzone}
 */

/**
 * Include the Logo and the dropzone.
 */
export default class Homeview extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="h-full">
        <div className="collapse bg-[#F3F4F6]
        dark:shadow-[inset_0px_-2px_2px_0px_rgba(255,255,255,1)]
        shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.1)]
        dark:border-b-[#414357]"
        enter="ease-in-out " id="collapseExample">
          <div className="block dark:bg-[#272938]">
            <div>
              {/* Replace with your content */}
              <HomePageLayerDropzone/>
              {/* /End replace */}
            </div>
          </div>
        </div>
        {/* Box-shadow generator to help anpms djust the effect
          https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Backgrounds_and_Borders/Box-shadow_generator */}
        <div className="flex justify-center h-full">
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

