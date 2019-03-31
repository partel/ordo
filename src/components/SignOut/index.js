import React from "react";
import {withFirebase} from "../Firebase";
import Button from "react-bootstrap/Button";

const SignOutButton = ({firebase}) => (
  <Button type="button" onClick={firebase.doSignOut} size="sm" variant="outline-dark">
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
