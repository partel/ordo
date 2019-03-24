import {action, computed, decorate, observable} from "mobx";

class UserStore {
  users = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  setUsers = usersSnapshot => {
    usersSnapshot.forEach(doc =>
      this.setUser(doc.data(), doc.id)
    )
  };

  setUser = (user, uid) => {
    if (!this.users) {
      this.users = {};
    }
    this.users[uid] = user;
  };

  get userList() {
    return Object.keys(this.users || {}).map(key => ({
      ...this.users[key],
      uid: key
    }));
  }
}

export default decorate(UserStore, {
  users: observable,
  setUsers: action,
  setUser: action,
  userList: computed
});
