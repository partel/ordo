import React, {Component} from "react";
import {Link} from "react-router-dom";

import {withFirebase} from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Form from "react-bootstrap/Form";
import {withTranslation} from "react-i18next";
import {compose} from "recompose";

const PasswordForgetPage = ({t}) => (
  <>
    <h1>{t("passForget:Password forget")}</h1>
    <PasswordForgetForm/>
  </>
);

const INITIAL_STATE = {
  email: "",
  error: null
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  onSubmit = event => {
    const {email} = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({...INITIAL_STATE});
      })
      .catch(error => {
        this.setState({error});
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    const {email, error} = this.state;
    const isInvalid = email === "";
    const {t} = this.props;

    return (
      <Form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder={t("passForget:Email Address")}
        />
        <button disabled={isInvalid} type="submit">
          {t("passForget:Reset My Password")}
        </button>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

const PasswordForgetLink = withTranslation()(({t}) => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>{t("passForgetLink:Forgot Password")}</Link>
  </p>
));

export default withTranslation()(PasswordForgetPage);

const PasswordForgetForm = compose(
  withTranslation(),
  withFirebase
)(PasswordForgetFormBase);

export {PasswordForgetForm, PasswordForgetLink};
