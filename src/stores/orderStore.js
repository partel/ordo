import {action, computed, decorate, observable} from "mobx";
import * as STATES from "../constants/states";

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
  stateFilter = STATES.REQUESTED;
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

  setStateFilter = newState => {
    this.stateFilter = newState;
  };

  setCurrentOrder = order => {
    this.currentOrder = order;
  };

  setCurrentOrderRef = ref => {
    this.currentOrderRef = ref;
  };

  get ordersList() {
    return Object.keys(this.orders || {})
      .map(key => ({
        ...this.orders[key],
        uid: key
      }))
      .filter(order => order.state === this.stateFilter);
  }
}

export default decorate(OrderStore, {
  orders: observable,
  limit: observable,
  stateFilter: observable,
  currentOrder: observable,
  currentOrderSnapshot: observable,
  setOrders: action,
  setLimit: action,
  setStateFilter: action,
  setCurrentOrder: action,
  setCurrentOrderSnapshot: action,
  ordersList: computed
});
