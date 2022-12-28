/* eslint-disable require-jsdoc */
import React, {Component} from 'react';

export default class VR extends Component {
  render() {
    return (
      <iframe
        src="vr.html"
        width="100%"
        height="100%"
        title="iframe"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      ></iframe>
    );
  }
}
