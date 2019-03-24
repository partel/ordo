import {action, computed, decorate, observable} from "mobx";

class OrderStore {
  orders = null;
  limit = 5;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  setOrders = ordersSnapshot => {
    this.orders = {};
    ordersSnapshot.forEach(doc => this.orders[doc.id] = doc.data());
  };

  setLimit = limit => {
    this.limit = limit;
  };

  get ordersList() {
    return Object.keys(this.orders || {}).map(key => ({
      ...this.orders[key],
      uid: key
    }));
  }
}

export default decorate(OrderStore, {
  orders: observable,
  limit: observable,
  setOrders: action,
  setLimit: action,
  ordersList: computed
});
