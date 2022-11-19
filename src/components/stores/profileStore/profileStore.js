/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';


class ProfileStore {
  ProfileId = 1; // default value

  /**
   * Creating observable state
   */
  constructor() {
    makeAutoObservable(this);
  }
  incrementProfileKey = () => {
    this.ProfileId += 1;
  };

  decodeProfile(buffer, mime) {
    let data = new Uint8Array(buffer);
    let len = data.length;
    if (mime == 'application/gzip') {
      data = pako.ungzip(data);
      len = data.length;
      const newBuf = window.Module._malloc(data.length);
      window.Module.HEAPU8.set(data, newBuf);
      const result = window.Module._decode(newBuf, len);
      return result;
    } else {
      let newBuf = window.Module._malloc(data.length);
      Module.HEAPU8.set(data, newBuf);
      let result =window.Module._decode(newBuf, len);
      if (result == 1) {
        try {
          data = pako.ungzip(data);
          len = data.length;
          newBuf = window.Module._malloc(data.length);
          Module.HEAPU8.set(data, newBuf);
          result = window.Module._decode(newBuf, len);
        } catch (error) {
          return 1;
        }
      }
      return result;
    }
  }
}
const profileStore = new ProfileStore();
export default profileStore;
