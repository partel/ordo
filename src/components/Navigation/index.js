import React from "react";
import {inject, observer} from "mobx-react";
import {compose} from "recompose";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";

const Navigation = ({sessionStore}) => (sessionStore.authUser
  ? <NavigationAuth authUser={sessionStore.authUser}/>
  : <NavigationNonAuth/>)
;

const NavigationAuth = ({authUser}) => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href={ROUTES.LANDING}>Ordo</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav>
        <Nav.Link href={ROUTES.ORDERS}>Orders</Nav.Link>
        {
          authUser.roles.includes(ROLES.ADMIN) && (
            <Nav.Link href={ROUTES.ADMIN}>Admin</Nav.Link>
          )
        }
        <Nav.Link href={ROUTES.ACCOUNT}>{authUser.username}</Nav.Link>
        <Form inline>
          <SignOutButton/>
        </Form>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar bg="light" expand="lg">
    <Nav>
      <Navbar.Brand href={ROUTES.LANDING}>Ordo</Navbar.Brand>

      <Nav.Link href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
    </Nav>
  </Navbar>
);

export default compose(
  inject("sessionStore"),
  observer
)(Navigation);
