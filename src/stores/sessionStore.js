import { observable, action, decorate } from "mobx";

class SessionStore {
  authUser = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  setAuthUser = authUser => {
    this.authUser = authUser;
  };
}

export default decorate(SessionStore, {
  authUser: observable,
  setAuthUser: action
});
