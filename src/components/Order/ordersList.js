import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";
import * as ROUTES from "../../constants/routes";
import {withRouter} from "react-router-dom";

class OrderItem extends Component {
  onEditOrder = uid => {
    this.props.history.push({
      pathname: `${ROUTES.ORDERS}/${uid}`
    });
  };

  render() {
    const {order, onRemoveOrder} = this.props;

    return (
      <Card style={{width: '18rem'}}>
        <Card.Header>{order.number}</Card.Header>
        <Card.Body>
          <Card.Title>{order.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{order.quantity}</Card.Subtitle>
          <Card.Text>{order.description}</Card.Text>

          <Button variant="secondary" onClick={() => onRemoveOrder(order.uid)}>Delete</Button>
          <Button variant="primary" onClick={() => this.onEditOrder(order.uid)}>Edit</Button>
        </Card.Body>
      </Card>
    );
  }
}

const OrderWithRouter = withRouter(OrderItem);

const OrdersList = ({orders, onEditOrder, onRemoveOrder}) => (
  <CardDeck>
    {orders.map(order => (
      <OrderWithRouter
        key={order.uid}
        order={order}
        onEditOrder={onEditOrder}
        onRemoveOrder={onRemoveOrder}
      />
    ))}
  </CardDeck>
);

export default OrdersList;
