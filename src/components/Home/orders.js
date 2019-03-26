import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {compose} from "recompose";

import OrdersList from "./ordersList";
import {withFirebase} from "../Firebase";
import Spinner from "react-bootstrap/Spinner";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {text: "", loading: false};
  }

  componentDidMount() {
    if (!this.props.orderStore.ordersList) {
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

  onEditOrder = (order, text) => {
    this.props.firebase.order(order.uid).set({
      ...order,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP
    });
  };

  onCreateOrder = (event, authUser) => {
    this.props.firebase.orders().add({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP
    });
    this.setState({text: ""});
    event.preventDefault();
  };

  render() {
    const {users, orderStore, sessionStore} = this.props;
    const {text, loading} = this.state;
    const orders = orderStore.ordersList;

    return (
      <div>
        {!loading && orders && (
          <button type="button" onClick={this.onNextPage}>
            More
          </button>
        )}

        {loading && <Spinner animation="border"/>}

        {orders ? (
          <OrdersList
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

        <form
          onSubmit={event => this.onCreateOrder(event, sessionStore.authUser)}
        >
          <textarea value={text} onChange={this.onChangeText}/>
          <button type="submit">Put order</button>
        </form>
      </div>
    );
  }
}

export default compose(
  withFirebase,
  inject("orderStore", "sessionStore"),
  observer
)(Orders);
