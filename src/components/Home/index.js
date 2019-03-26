import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {compose} from "recompose";

import {withAuthorization, withEmailVerification} from "../Session";
import {withFirebase} from "../Firebase";
import Orders from "./orders"

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.firebase.users().onSnapshot(snapshot => {
      this.props.userStore.setUsers(snapshot);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <>
        <h1>Ordo Home</h1>
        <p>User orders and add new order</p>

        <Orders users={this.props.userStore.users}/>
      </>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  inject("userStore"),
  observer,
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
