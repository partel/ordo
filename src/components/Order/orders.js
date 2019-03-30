import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import * as ROUTES from "../../constants/routes";

import OrderList from "./ordersList"

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {text: "", loading: false};
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
    this.unsubscribe = this.props.firebase
      .orders()
      .limit(this.props.orderStore.limit)
      .onSnapshot(snapshot => {
        this.props.orderStore.setOrders(snapshot);
        this.setState({loading: false});
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onNextPage = () => {
    this.props.orderStore.setLimit(this.props.orderStore.limit + 5);
  };

  componentDidUpdate(props) {
    if (props.orderStore.limit !== this.props.orderStore.limit) {
      this.onListenForOrders();
    }
  }

  onChangeText = event => {
    this.setState({text: event.target.value});
  };

  onRemoveOrder = uid => {
    this.props.firebase.order(uid).delete();
  };

  onEditOrder = uid => {
    this.props.history.push(`${ROUTES.ORDERS}/${uid}`);
  };

  newOrder = () => {
    this.props.history.push(`${ROUTES.ORDERS}/${"new"}`);
  };

  render() {
    const {users, orderStore} = this.props;
    const {loading} = this.state;
    const orders = orderStore.ordersList;

    return (
      <div>
        <h1>Active orders <Button variant="outline-primary" onClick={this.newOrder}>Add New</Button></h1>

        {loading && <Spinner animation="border"/>}

        {orders ? (
          <OrderList
            orders={orders.map(order => ({
              ...order,
              user:
                users && users[order.userId]
                  ? users[order.userId]
                  : {userId: order.userId}
            }))}
            onEditOrder={this.onEditOrder}
            onRemoveOrder={this.onRemoveOrder}
          />
        ) : (
          <div>There are no orders...</div>
        )}

        {!loading && orders && (
          <button type="button" onClick={this.onNextPage}>
            More
          </button>
        )}
      </div>
    );
  }
}

export default compose(
  withFirebase,
  inject("orderStore", "sessionStore"),
  observer
)(Orders);
