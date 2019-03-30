import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import * as ROLES from "../../constants/roles";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import {inject, observer} from "mobx-react";
import Modal from "react-bootstrap/Modal";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

class UserCompaniesBase extends Component {
  onClickRemove = (event) => {
    this.props.onRemoveUserFromCompany(event.target.value)
  };

  render() {
    const {companies, companyStore} = this.props;
    return companies ?
      (<ListGroup variant="flush">
        {companies.map(code =>
          <ListGroup.Item key={code}>
            <Row>
              <Col key="name">{companyStore.getByCode(code).name}</Col>
              <Col key="action">
                <Button variant="outline-danger" onClick={this.onClickRemove} value={code} size="sm">
                  Remove
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        )}
      </ListGroup>)

      : <Alert variant="warning">Assign to company! No companies currently</Alert>
  }
}

const UserCompanies = compose(
  inject("companyStore"))(UserCompaniesBase);

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
    const companies = this.props.user.companies || [];
    if (!companyCode || companies.includes(companyCode)) {
      return
    }
    companies.push(companyCode);
    this.setUserCompanies(companies);
  };

  onRemoveUserCompany = (companyCode) => {
    const companies = this.props.user.companies || [];
    if (!companyCode || !companies.includes(companyCode)) {
      return
    }
    this.setUserCompanies(companies.filter(value => companyCode !== value));
  };

  setUserCompanies(companies) {
    this.props.firebase.user(this.props.user.uid).update({
      companies: companies
    }).catch(error =>
      this.setState({error: error}));
    this.onCloseAddCompanyModal();
  }

  render() {
    const {email, username, companies} = this.props.user;
    const isAdmin = this.props.user.roles.includes(ROLES.ADMIN);
    const {showModal, error} = this.state;
    const companiesForAdd = this.props.companyStore.companyList.filter(company => !(companies || []).includes(company.code));
    return <>
      {error && <Alert varian="danger">{error.message}</Alert>}
      <Card>
        <Card.Header>{email}</Card.Header>
        <Card.Body>
          <Card.Title>{username} {isAdmin && <Badge variant="info">Admin!</Badge>} </Card.Title>
          <Card.Subtitle>
            {!isAdmin &&
            <Button variant="primary" size="sm" onClick={this.onOpenAddUserCompanyModal}>Add user company</Button>}
          </Card.Subtitle>
          <Card.Body>
            {!isAdmin &&
            <UserCompanies companies={companies} onRemoveUserFromCompany={this.onRemoveUserCompany}/>}
          </Card.Body>
        </Card.Body>
      </Card>
      <AddUserCompanyModal show={showModal}
                           onHide={this.onCloseAddCompanyModal}
                           onSelect={this.onAddUserCompany}
                           username={username}
                           companyList={companiesForAdd}/>
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
