import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {inject, observer} from "mobx-react";
import * as STATES from "../../constants/states";
import {withTranslation} from "react-i18next";

const OrderCard = (props) => {
  const {t} = props;
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
      {canCancel && <Button variant="secondary" onClick={props.onCancel}>{t("Cancel Order")}</Button>}
      {canMarkDone && <Button variant="primary" onClick={() => props.onDone(order.uid)}>{t("Done")}</Button>}
      {canConfirm &&
      <Button variant="primary" onClick={() => props.onDone(order.uid, new Date())}>{t("Confirm")}</Button>}
    </Card.Footer>
  </Card>;
};

const OrdersList = ({orderStore, sessionStore, onCancelOrder, onOrderDone, onConfirmOrder, onOpenOrder, t}) => (
  <CardDeck>
    {orderStore.ordersList.map(order => (
      <OrderCard key={order.uid}
                 order={order}
                 isAdmin={sessionStore.isAdmin}
                 onCancel={onCancelOrder}
                 onOpen={onOpenOrder}
                 onDone={onOrderDone}
                 onConfirm={onConfirmOrder}
                 t={t}
      />
    ))}
  </CardDeck>
);

export default compose(
  withTranslation(),
  withRouter,
  inject("sessionStore", "orderStore"),
  observer
)(OrdersList);