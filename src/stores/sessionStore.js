import {action, computed, decorate, observable} from "mobx";
import {ADMIN} from "../constants/roles";

class SessionStore {
  authUser = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  setAuthUser = authUser => {
    this.authUser = authUser;
  };

  get isAdmin() {
    return ((this.authUser || {}).roles || []).includes(ADMIN);
  }

  get companyCode() {
    return this.authUser.companyCode || "";
  }

  get companyName() {
    return this.authUser.companyName;
  }
}

export default decorate(SessionStore, {
  authUser: observable,
  setAuthUser: action,
  isAdmin: computed,
  companyCode: computed,
  companyName: computed
});
