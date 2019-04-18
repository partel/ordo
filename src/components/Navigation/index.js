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

const Navigation = ({sessionStore}) => (sessionStore.authUser
  ? <NavigationAuth authUser={sessionStore.authUser}/>
  : <NavigationNonAuth/>)
;

const NavigationAuth = withTranslation()(({authUser, t}) => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href={ROUTES.LANDING}>{t("navbar:Ordo")}</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav>
        <Nav.Link href={ROUTES.ORDERS}>{t("navbar:Orders")}</Nav.Link>
        {
          authUser.roles.includes(ROLES.ADMIN) && (
            <Nav.Link href={ROUTES.ADMIN}>{t("navbar:Admin")}</Nav.Link>
          )
        }
        <Nav.Link href={ROUTES.ACCOUNT}>
          {formatUsername(authUser)}
        </Nav.Link>
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
      <Navbar.Brand href={ROUTES.LANDING}>{t("navbar:Ordo")}</Navbar.Brand>

      <Nav.Link href={ROUTES.SIGN_IN}>{t("navbar:Sign In")}</Nav.Link>
    </Nav>
  </Navbar>
));

export default compose(
  inject("sessionStore"),
  observer
)(Navigation);
