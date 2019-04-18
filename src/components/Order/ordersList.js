import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {inject, observer} from "mobx-react";
import * as STATES from "../../constants/states";
import {useTranslation} from "react-i18next";

const OrderCard = (props) => {
  const {t} = useTranslation();
  const canCancel = props.order.state === STATES.REQUESTED || (props.isAdmin && props.order.state !== STATES.CANCELLED);
  const canMarkDone = (props.isAdmin && props.order.state === STATES.CONFIRMED);
  const canConfirm = (props.isAdmin && props.order.state === STATES.REQUESTED);
  const order = props.order;
  return <Card style={{width: "18rem"}}>
    <Card.Header>
      <Button variant="outline-primary" onClick={() => props.onOpen(order.uid)}>{props.order.number}</Button>
    </Card.Header>
    <Card.Body>
      <Card.Title>{props.order.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{props.order.quantity}</Card.Subtitle>
      <Card.Text>{props.order.description}</Card.Text>
    </Card.Body>
    <Card.Footer>
      {canCancel && <Button variant="secondary" onClick={props.onCancel}>{t("orders:Cancel Order")}</Button>}
      {canMarkDone &&
      <Button variant="primary" onClick={() => props.onDone(order.uid)}>{t("orders:Mark Order Done")}</Button>}
      {canConfirm &&
      <Button variant="primary"
              onClick={() => props.onConfirm(order.uid, new Date())}>{t("orders:Confirm Order")}</Button>}
    </Card.Footer>
  </Card>;
};

const OrdersList = ({orderStore, sessionStore, onCancelOrder, onOrderDone, onConfirmOrder, onOpenOrder}) => (
  <CardDeck>
    {orderStore.ordersList.map(order => (
      <OrderCard key={order.uid}
                 order={order}
                 isAdmin={sessionStore.isAdmin}
                 onCancel={onCancelOrder}
                 onOpen={onOpenOrder}
                 onDone={onOrderDone}
                 onConfirm={onConfirmOrder}
      />
    ))}
  </CardDeck>
);

export default compose(
  withRouter,
  inject("sessionStore", "orderStore"),
  observer
)(OrdersList);