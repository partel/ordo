import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

import {SignUpLink} from "../SignUp";
import {PasswordForgetLink} from "../PasswordForget";
import * as ROUTES from "../../constants/routes";
import Alert from "react-bootstrap/Alert";
import {withFirebase} from "../Firebase";
import {withTranslation} from "react-i18next";

const SignInPage = ({t}) => (
  <>
    <h1>{t("signIn:Sign In")}</h1>
    <SignInForm/>
    <PasswordForgetLink/>
    <SignUpLink/>
  </>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {...INITIAL_STATE};
  }

  onSubmit = event => {
    const {email, password} = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({...INITIAL_STATE});
        this.props.history.push(ROUTES.ORDERS);
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
    const {email, password, error} = this.state;
    const isInvalid = password === "" || email === "";
    const {t} = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder={t("signIn:Email address")}
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder={t("signIn:Password")}
        />
        <button disabled={isInvalid} type="submit">
          {t("signIn:Sign In")}
        </button>
        {error && <Alert varian="danger">{error.message}</Alert>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
  withTranslation()
)(SignInFormBase);

export default withTranslation()(SignInPage);
export {SignInForm};
