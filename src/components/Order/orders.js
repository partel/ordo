import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import * as ROUTES from "../../constants/routes";
import * as STATES from "../../constants/states";

import OrderList from "./ordersList"
import Alert from "react-bootstrap/Alert";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import {withTranslation} from "react-i18next";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, error: null};
  }

  componentDidMount() {
    if (!this.props.orderStore.ordersList.length) {
      this.setState({loading: true});
    }
    this.onListenForOrders();
  }

  onListenForOrders() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    const sessionStore = this.props.sessionStore;
    const query = sessionStore.isAdmin ? this.props.firebase.orders() : this.props.firebase.ordersByCompany(sessionStore.companyCode);
    this.unsubscribe = query
    //.orderBy("createdAt", "desc")
      .limit(this.props.orderStore.limit)
      .onSnapshot(
        snapshot => {
          this.props.orderStore.setOrders(snapshot);
          this.setState({loading: false, error: null});
        },
        error => this.setState({loading: false, error: error},
          () => this.setState({loading: false})));
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onNextPage = () => {
    this.props.orderStore.setLimit(this.props.orderStore.limit + 5);
  };

  componentDidUpdate(props) {
    if (props.orderStore.limit !== this.props.orderStore.limit) {
      this.onListenForOrders();
    }
  }

  onCancelOrder = uid => {
    this.props.firebase.order(uid).update({
      state: STATES.CANCELLED
    }).catch(error =>
      this.setState({error: error}));
  };

  onOrderDone = uid => {
    this.props.firebase.order(uid).update({
      state: STATES.DONE,
      doneAt: this.props.firebase.fieldValue.serverTimestamp()
    }).catch(error =>
      this.setState({error: error}));
  };

  onConfirmOrder = (uid, plannedDate) => {
    this.props.firebase.order(uid).update({
      state: STATES.CONFIRMED,
      plannedDoneAt: plannedDate
    }).catch(error =>
      this.setState({error: error}));
  };

  onOpenOrder = uid => {
    this.props.history.push(`${ROUTES.ORDERS}/${uid}`);
  };

  newOrder = () => {
    this.props.history.push(`${ROUTES.ORDERS}/${"new"}`);
  };

  onChangeFilter = (value) => {
    this.props.orderStore.setStateFilter(value);
  };

  render() {
    const {orderStore, t} = this.props;
    const {loading, error} = this.state;
    const orders = orderStore.ordersList;

    return (
      <div>
        <h1>{t("Orders")}<Button variant="outline-primary" onClick={this.newOrder}>{t("Add New")}</Button></h1>

        <ToggleButtonGroup type="radio" name="filter" value={orderStore.stateFilter} onChange={this.onChangeFilter}>
          <ToggleButton value={STATES.REQUESTED}>{t(STATES.REQUESTED)}</ToggleButton>
          <ToggleButton value={STATES.CONFIRMED}>{t(STATES.CONFIRMED)}</ToggleButton>
          <ToggleButton value={STATES.DONE}>{t(STATES.DONE)}</ToggleButton>
        </ToggleButtonGroup>

        {loading && <Spinner animation="border"/>}
        {error && <Alert variant="danger">{`${error.code}: ${error.message}`}</Alert>}
        {orders && orders.length ? (
          <OrderList
            onCancelOrder={this.onCancelOrder}
            onOrderDone={this.onOrderDone}
            onConfirmOrder={this.onConfirmOrder}
            onOpenOrder={this.onOpenOrder}
          />
        ) : (
          <Alert variant="warning">{t("There are no orders...")}</Alert>
        )}

        {orders && orders.length === this.props.orderStore.limit && (
          <button type="button" onClick={this.onNextPage}>
            More
          </button>
        )}
      </div>
    );
  }
}

export default compose(
  withTranslation(),
  withFirebase,
  inject("orderStore", "sessionStore"),
  observer
)(Orders);
