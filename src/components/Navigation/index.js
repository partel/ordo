import React from "react";
import {inject, observer} from "mobx-react";
import {compose} from "recompose";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import {withTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const Navigation = ({sessionStore}) => (sessionStore.authUser
  ? <NavigationAuth authUser={sessionStore.authUser}/>
  : <NavigationNonAuth/>)
;

const NavigationAuth = withTranslation()(({authUser, t}) => (
  <Navbar bg="light" expand="lg">
    <Link className="navbar-brand" to={ROUTES.LANDING}>{t("navbar:Ordo")}</Link>
    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav>
        <Link className="nav-link" to={ROUTES.ORDERS}>{t("navbar:Orders")}</Link>
        {
          authUser.roles.includes(ROLES.ADMIN) && (
            <Link className="nav-link" to={ROUTES.ADMIN}>{t("navbar:Admin")}</Link>
          )
        }
        <Link className="nav-link" to={ROUTES.ACCOUNT}>{formatUsername(authUser)}</Link>
        <Form inline>
          <SignOutButton/>
        </Form>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
));

const formatUsername = (authUser) => {
  return authUser.companyName ? `${authUser.username} [${authUser.companyName}]` : authUser.username;
};

const NavigationNonAuth = withTranslation()(({t}) => (
  <Navbar bg="light" expand="lg">
    <Nav>
      <Link className="navbar-brand" to={ROUTES.LANDING}>{t("navbar:Ordo")}</Link>
      <Link className="nav-link" to={ROUTES.SIGN_IN}>{t("navbar:Sign In")}</Link>
    </Nav>
  </Navbar>
));

export default compose(
  inject("sessionStore"),
  observer
)(Navigation);
