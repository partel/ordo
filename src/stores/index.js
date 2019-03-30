import SessionStore from "./sessionStore";
import UserStore from "./userStore";
import CompanyStore from "./companyStore";
import OrderStore from "./orderStore";

class RootStore {
  constructor() {
    this.sessionStore = new SessionStore(this);
    this.userStore = new UserStore(this);
    this.companyStore = new CompanyStore(this);
    this.orderStore = new OrderStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
