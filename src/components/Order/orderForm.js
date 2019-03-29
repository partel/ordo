import React, {Component} from "react";
import * as ROUTES from "../../constants/routes";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import {withFirebase} from "../Firebase";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Badge from "react-bootstrap/Badge";

const INITIAL_STATE = {
  name: "",
  number: "",
  quantity: "",
  description: "",
  deadline: null,

  validated: false,
  error: null
};

const CATEGORIES = ['Tampo', 'Siid', 'Tikand'];

class OrderForm extends Component {

  constructor(props) {
    super(props);
    CATEGORIES.forEach(cat => INITIAL_STATE[`is${cat}`] = false);

    this.state = {...INITIAL_STATE};
  }

  isNew = () => this.props.match.params.id === "new";


  componentDidMount() {
    if (!this.isNew()) {
      this.props.firebase.order(this.props.match.params.id).get()
        .then(snapshot => {
          const order = snapshot.data();
          if (order.deadline) {
            order.deadline = new Date(order.deadline.seconds * 1000)
          }
          return this.setState({...order});
        })
        .catch(error => this.setState({error: error}))
    }
  }

  componentWillUnmount() {
  }

  handleSubmit(event) {
    const {name, number, quantity, description, deadline} = this.state;
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    this.setState({validated: true});
    if (form.checkValidity() === true) {
      const orderData = {
        name,
        number,
        quantity,
        description,
        deadline
      };
      if (this.isNew()) {
        this.props.firebase.orders().add(orderData).then(() => this.closeForm())
          .catch(error => this.setState({error: error}));
      } else {
        this.props.firebase.order(this.props.match.params.id).set(orderData).then(() => this.closeForm())
          .catch(error => this.setState({error: error}));
      }

    }
  }

  closeForm = () => this.props.history.push(ROUTES.ORDERS);

  onChange = event => {
    this.setState({[event.target.id]: event.target.value});
  };

  onChangeCheckBox = event => {
    this.setState({[event.target.id]: event.target.checked});
  };

  onChangeDate = date => {
    this.setState({deadline: date});
  };

  render() {
    const {name, number, quantity, description, deadline, validated, error} = this.state;

    return (
      <>
        <h1>Order <Badge pill variant="info">{this.props.match.params.id}</Badge></h1>
        {error ? (<Alert varian="danger">{error.message}</Alert>) :
          (<Form noValidate validated={validated} onSubmit={e => this.handleSubmit(e)}>
            <Form.Row>
              <Form.Group as={Col} controlId="name">
                <Form.Label>Order name</Form.Label>
                <Form.Control type="text" placeholder="Order name" value={name} onChange={this.onChange} required/>
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="number">
                <Form.Label>Order number</Form.Label>
                <Form.Control type="text" placeholder="Order number" value={number} onChange={this.onChange} required/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="4" controlId="quantity">
                <Form.Label>Order quantity</Form.Label>
                <Form.Control type="text" placeholder="Order quantity" value={quantity} onChange={this.onChange}
                              required/>
                {CATEGORIES.map(cat =>
                  <Form.Check key={cat} inline label={cat} id={`is${cat}`} onChange={this.onChangeCheckBox}/>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group controlId="deadline">
                <Form.Label>Requested deadline</Form.Label><br/>
                <DatePicker selected={deadline} onChange={this.onChangeDate} dateFormat="dd.MM.yyyy"
                            dropdownMode="scroll" className="form-control" id="deadline" required/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows="7" value={description} onChange={this.onChange}/>
              </Form.Group>
            </Form.Row>

            <Button variant="secondary" onClick={this.closeForm} type="reset">Cancel</Button>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>)}
      </>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(OrderForm);