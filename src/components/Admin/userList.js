import React, {Component} from "react";
import {Link} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import {inject, observer} from "mobx-react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    if (!this.props.userStore.users) {
      this.setState({loading: true});
    }

    this.unsubscribe = this.props.firebase.users().onSnapshot(snapshot => {
      this.props.userStore.setUsers(snapshot);
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const users = this.props.userStore.userList;
    const {loading} = this.state;
    return (
      <div>
        <h2>Users</h2>
        {loading && <Spinner animation="border"/>}
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>ID</th>
            <th>E-Mail</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          {users.map(user => (
            <tr key={user.uid}>
              <td>
                <Link to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`
                }}
                >{user.uid}
                </Link>
              </td>
              <td>{user.email}</td>
              <td>{user.username}</td>
            </tr>
          ))}
          </tbody>
        </Table>

      </div>
    );
  }
}

export default compose(
  withFirebase,
  inject("userStore"),
  observer
)(UserList);
