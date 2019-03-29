import React from "react";
import OrderForm from "./orderForm";
import Orders from "./orders";
import {Route, Switch} from "react-router";
import * as ROUTES from "../../constants/routes";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import {inject, observer} from "mobx-react";
import {withAuthorization, withEmailVerification} from "../Session";


const OrdersPage = () => (
  <Switch>
    <Route exact path={ROUTES.ORDERS} component={Orders}/>
    <Route exact path={ROUTES.ORDER} component={OrderForm}/>
  </Switch>
);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  inject("userStore"),
  observer,
  withEmailVerification,
  withAuthorization(condition)
)(OrdersPage);
