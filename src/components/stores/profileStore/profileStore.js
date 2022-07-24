/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import {makeAutoObservable} from 'mobx';


class ProfileStore {
  ProfileId = 1; // default value
  IsDragOver = false;
  /**
   * Creating observable state
   */
  constructor() {
    makeAutoObservable(this);
  }
  incrementProfileKey = () => {
    this.ProfileKey += 1;
  };
  setIsDragOver = (value) => {
    this.IsDragOver = value;
  };
}
const profileStore = new ProfileStore();
export default profileStore;
