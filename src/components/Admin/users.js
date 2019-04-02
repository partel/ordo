import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import * as ROLES from "../../constants/roles";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import CardDeck from "react-bootstrap/CardDeck";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import {inject, observer} from "mobx-react";

class AddUserCompanyModal extends Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add user {this.props.username} to company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton id="dropdown-basic-button" title="Chooose company">
            {this.props.companyList.map(company =>
              <Dropdown.Item key={company.code}
                             eventKey={company.code}
                             onSelect={this.props.onSelect}>
                {company.name}
              </Dropdown.Item>
            )}
          </DropdownButton>
        </Modal.Body>
      </Modal>
    );
  }
}

class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false, error: null};
  }

  onOpenAddUserCompanyModal = () => {
    this.setState({showModal: true});
  };

  onCloseAddCompanyModal = () => {
    this.setState({showModal: false});
  };

  onAddUserCompany = (companyCode) => {
    this.props.firebase.user(this.props.user.uid).update({
      companyCode: companyCode
    }).catch(error =>
      this.setState({error: error}));
    this.onCloseAddCompanyModal();
  };

  onRemoveUserCompany = () => {
    this.props.firebase.user(this.props.user.uid).update({
      companyCode: ""
    }).catch(error =>
      this.setState({error: error}));
    this.onCloseAddCompanyModal();
  };

  render() {
    const {email, username, companyCode} = this.props.user;
    const isAdmin = (this.props.user.roles || []).includes(ROLES.ADMIN);
    const {showModal, error} = this.state;
    return <>
      {error && <Alert varian="danger">{error.message}</Alert>}
      <Card>
        <Card.Header>{email}</Card.Header>
        <Card.Body>
          <Card.Title>{username} {isAdmin && <Badge variant="info">Admin!</Badge>} </Card.Title>
          <Card.Subtitle>
            {(!companyCode && !isAdmin) &&
            (
              <Alert variant="warning">No companies currently
                <Button variant="primary" size="sm" onClick={this.onOpenAddUserCompanyModal}>Assign to company!</Button>
              </Alert>
            )}
            {companyCode &&
            <DropdownButton variant="success" title={this.props.companyStore.getByCode(companyCode).name}>
              <Dropdown.Item href="#" onClick={this.onRemoveUserCompany}>Remove user from company</Dropdown.Item>
            </DropdownButton>
            }
          </Card.Subtitle>
        </Card.Body>
      </Card>
      <AddUserCompanyModal show={showModal}
                           onHide={this.onCloseAddCompanyModal}
                           onSelect={this.onAddUserCompany}
                           username={username}
                           companyList={this.props.companyStore.companyList}/>
    </>
  }
}

const Users = (props) => {
  const {userStore, companyStore, firebase} = props;
  return (<CardDeck>
    {userStore.userList.map(user =>
      <UserCard key={user.uid} user={user} firebase={firebase}
                companyStore={companyStore}/>)
    }
  </CardDeck>)
};

export default compose(
  withFirebase,
  inject("userStore", "companyStore"),
  observer
)(Users);
