import React, {Component} from "react";
import * as ROUTES from "../../constants/routes";
import * as CATEGORIES from "../../constants/categories";
import * as STATES from "../../constants/states";
import Form from "react-bootstrap/Form";

import Col from "react-bootstrap/Col";
import "react-datepicker/dist/react-datepicker.css";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import {compose} from "recompose";
import {withRouter} from "react-router";
import {withFirebase} from "../Firebase";
import {inject, observer} from "mobx-react";
import Spinner from "react-bootstrap/Spinner";
import {withTranslation} from "react-i18next";

const EMPTY_ORDER = {
  name: "",
  number: "",
  quantity: "",
  description: "",
  deadline: null,
  state: STATES.DRAFT,
  categories: []
};

class OrderForm extends Component {

  constructor(props) {
    super(props);
    props.orderStore.setCurrentOrder({...EMPTY_ORDER});
    this.state = {validated: false, error: null, loading: false};
  }

  isNew = () => this.props.match.params.id === "new";

  currentOrder = () => this.props.orderStore.currentOrder;

  componentDidMount() {
    this.setState({loading: true});
    const orderRef = this.isNew() ? this.props.firebase.newOrder() : this.props.firebase.order(this.props.match.params.id);
    this.props.orderStore.setCurrentOrderRef(orderRef);

    orderRef.get().then(snapshot => {
      if (snapshot.exists) {
        const order = snapshot.data();
        if (order.deadline) {
          order.deadline = new Date(order.deadline.seconds * 1000)
        }
        this.props.orderStore.setCurrentOrder({...order})
      } else {
        this.props.orderStore.setCurrentOrder({
          ...EMPTY_ORDER,
          creator: this.props.sessionStore.authUser.uid,
          company: this.props.sessionStore.companyCode,
          createdAt: this.props.firebase.fieldValue.serverTimestamp()
        });
        const company = this.props.firebase.company(this.props.sessionStore.companyCode);
        company.update({
          orderSequence: this.props.firebase.fieldValue.increment(1)
        }).then(() => {
          company.get().then(snapshot => {
            this.props.orderStore.currentOrder.number = `${company.id}${snapshot.data().orderSequence.toString().padStart(5, '0')}`
          })
        });
      }

      this.setState({loading: false})
    })
      .catch(error => this.setState({error: error, loading: false}))
  }

  onSubmit(event) {
    this.setState({validated: true});
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      const orderRef = this.props.orderStore.currentOrderRef;
      const orderData = this.props.orderStore.currentOrder;
      if (orderData.state === STATES.DRAFT) {
        orderData.state = STATES.REQUESTED;
      }
      this.setState({loading: true});
      orderRef.set(orderData)
        .then(() => this.onClose())
        .catch(error => this.setState({error: error, loading: false}));
    }
    event.preventDefault();
    event.stopPropagation();
  }

  onClose = () => this.props.history.push(ROUTES.ORDERS);

  onChangeField = event => {
    this.currentOrder()[event.target.id] = event.target.value;
  };


  onChangeCategory = event => {
    const order = this.currentOrder();
    const category = event.target.id;
    if (event.target.checked && !order.categories.includes(category)) {
      this.currentOrder().categories.push(category);
    } else if (!event.target.checked) {
      this.currentOrder().categories = order.categories.filter(value => value !== category);
    }
  };

  onChangeDate = date => {
    this.currentOrder().deadline = date;
  };

  onUploadFiles = event => {
    const orderId = this.props.orderStore.currentOrderRef.id;
    const file = event.target.files[0];
    this.props.firebase.upload(orderId, file).then(snapshot => {
      if (!this.currentOrder().files) {
        this.currentOrder().files = [];
      }
      this.currentOrder().files.push(file.name);
    });
  };

  render() {
    const {validated, error, loading} = this.state;
    const order = this.currentOrder();
    const {t} = this.props;
    return (
      <>
        <h1>{t("order:Order")} <Badge pill variant="info">{t(`order:${order.state}`)}</Badge>
          {loading && <Spinner animation="border"/>}
        </h1>
        {error ? (<Alert varian="danger">{error.message}</Alert>) :
          (<Form noValidate validated={validated} onSubmit={e => this.onSubmit(e)}>
            <Form.Row>
              <Form.Group as={Col} controlId="name">
                <Form.Label>{t("order:Order name")}</Form.Label>
                <Form.Control type="text"
                              placeholder={t("order:Order short descriptive name")}
                              value={order.name}
                              onChange={this.onChangeField}
                              required/>
              </Form.Group>

              <Form.Group as={Col} md="5" controlId="quantity">
                <Form.Label>{t("order:Order quantity")}</Form.Label>
                <Form.Control type="text"
                              placeholder={t("order:Order quantity description")}
                              value={order.quantity}
                              onChange={this.onChangeField}
                              required/>
                {[CATEGORIES.SIID, CATEGORIES.TAMPO, CATEGORIES.TIKAND].map(category =>
                  <Form.Check key={category}
                              inline label={category}
                              id={category}
                              checked={order.categories.includes(category)}
                              onChange={this.onChangeCategory}/>
                )}

              </Form.Group>

              <Form.Group as={Col} md="2" controlId="number">
                <Form.Label>{t("order:Order number")}</Form.Label>
                <Form.Control type="text" readOnly placeholder={t("order:Autogenerated order number")}
                              value={order.number} required/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="deadline">
                <Form.Label>{t("order:Requested deadline")}</Form.Label><br/>
                <DatePicker selected={order.deadline} onChange={this.onChangeDate} dateFormat="dd.MM.yyyy"
                            dropdownMode="scroll" className="form-control" id="deadline" required/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="description">
                <Form.Label>{t("order:Longer Description")}</Form.Label>
                <Form.Control as="textarea" rows="7" value={order.description} onChange={this.onChangeField}/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group>
                <Form.Label>{t("order:Added files")}</Form.Label>
                <Form.Control name="files[]" type="file" multiple onChange={this.onUploadFiles}/>
              </Form.Group>
            </Form.Row>

            {(order.files || []).map(file => <div key={file}>{file}</div>)}

            <Button variant="secondary" onClick={this.onClose} type="reset">{t("order:Cancel")}</Button>
            <Button variant="primary" type="submit">{t("order:Submit")}</Button>
          </Form>)}
      </>
    );
  }
}

export default compose(
  withTranslation(),
  withRouter,
  withFirebase,
  inject("sessionStore", "orderStore"),
  observer
)(OrderForm);