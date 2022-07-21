/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';


class ProfileStore {
  ProfileKey = 1; // default value
  /**
   * Creating observable state
   */
  constructor() {
    makeAutoObservable(this);
  }
  incrementProfileKey = () => {
    this.ProfileKey += 1;
  };
}
const profileStore = new ProfileStore();
export default profileStore;
