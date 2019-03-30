import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CardDeck from "react-bootstrap/CardDeck";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import {inject, observer} from "mobx-react";
import Col from "react-bootstrap/Col";
import Alert from "../Order/orderForm";

const INITIAL_STATE = {
  code: "",
  name: "",

  validated: false,
  error: null
};

class NewCompanyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  onChange = event => {
    this.setState({[event.target.id]: event.target.value});
  };

  onSubmit = event => {
    const form = event.currentTarget;
    this.setState({validated: true});
    if (form.checkValidity() === true) {
      const {code, name} = this.state;
      this.props.firebase.company(code).set({name})
        .then(() => this.onclose())
        .catch(error => this.setState({error: error}));
    }
    event.preventDefault();
    event.stopPropagation();
  };

  onclose = () => {
    this.setState({...INITIAL_STATE});
    this.props.onHide();
  };

  render() {
    const {code, name, validated, error} = this.state;
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        {error && <Alert varian="danger">{error.message}</Alert>}
        <Form noValidate validated={validated} onSubmit={this.onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add new company</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Row>
              <Col xs lg="4">
                <Form.Group controlId="code">
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" required placeholder="Code" value={code} onChange={this.onChange}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" required placeholder="Company name" value={name} onChange={this.onChange}/>
                </Form.Group>
              </Col>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.onclose} type="reset">Close</Button>
            <Button variant="primary" type="submit">Add new company</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

class Companies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  
  onShowAddCompanyModal = () => {
    this.setState({showModal: true})
  };

  onCloseAddCompanyModal = () => {
    this.setState({showModal: false})
  };

  render() {
    const companies = this.props.companyStore.companyList;
    const {showModal} = this.state;
    return (
      <>
        <Button variant="primary" size="sm" onClick={this.onShowAddCompanyModal}>Add new company</Button>
        <NewCompanyModal show={showModal} onHide={this.onCloseAddCompanyModal} firebase={this.props.firebase}/>
        <CardDeck>
          {companies.map(company =>
            <Card key={company.code}>
              <Card.Header>{company.code}</Card.Header>
              <Card.Body>{company.name}</Card.Body>
            </Card>)
          }
        </CardDeck>
      </>
    )
  }
}

export default compose(
  withFirebase,
  inject("userStore", "companyStore"),
  observer
)(Companies);
