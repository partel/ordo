import {action, computed, decorate, observable} from "mobx";

/*
order:
  uid?
  name: string
  number: string
  quantity: string
  description: string
  deadline: date
  state: DRAFT/REQUESTED/CONFIRMED/DONE/CANCELLED,
  categories: []
 */
class OrderStore {
  orders = null;
  limit = 5;
  currentOrder = null;
  currentOrderRef = null;

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

  setCurrentOrder = order => {
    this.currentOrder = order;
  };

  setCurrentOrderRef = ref => {
    this.currentOrderRef = ref;
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
  currentOrder: observable,
  currentOrderSnapshot: observable,
  setOrders: action,
  setLimit: action,
  setCurrentOrder: action,
  setCurrentOrderSnapshot: action,
  ordersList: computed
});
