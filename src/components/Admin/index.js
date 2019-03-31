import React, {Component} from "react";
import {compose} from "recompose";
import {withAuthorization, withEmailVerification} from "../Session";
import Users from "./users";
import Companies from "./companies";
import * as ROLES from "../../constants/roles";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {withFirebase} from "../Firebase";
import {inject, observer} from "mobx-react";
import Spinner from "react-bootstrap/Spinner";

const INITIAL_STATE = {
  loadingUsers: false,
  loadingCompanies: false
};

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  componentDidMount() {
    if (!this.props.userStore.users) {
      this.setState({loadingUsers: true});
    }

    this.unsubscribeUserUpdates = this.props.firebase.users()
      .onSnapshot(snapshot => {
        this.props.userStore.setUsers(snapshot);
        this.setState({loadingUsers: false});
      });

    if (!this.props.companyStore.companies) {
      this.setState({loadingCompanies: true});
    }

    this.unsubscribeCompanyUpdates = this.props.firebase.companies().orderBy("name")
      .onSnapshot(snapshot => {
        this.props.companyStore.setCompanies(snapshot);
        this.setState({loadingCompanies: false});
      });

  }

  componentWillUnmount() {
    this.unsubscribeUserUpdates();
    this.unsubscribeCompanyUpdates();
  }

  render() {
    const loading = this.state.loadingUsers || this.state.loadingCompanies;
    return <>
      <h1>Admin</h1>
      {loading ?
        <Spinner animation="border"/>
        :
        <Tabs defaultActiveKey="users">
          <Tab eventKey="users" title="Users">
            <Users/>
          </Tab>
          <Tab eventKey="companies" title="Companies">
            <Companies/>
          </Tab>
        </Tabs>
      }
    </>
  }
}

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  withFirebase,
  inject("userStore", "companyStore"),
  observer,
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage);
