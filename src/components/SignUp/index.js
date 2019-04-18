import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {compose} from "recompose";

import {withFirebase} from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Form from "react-bootstrap/Form";
import {withTranslation} from "react-i18next";

const SignInUpPage = () => (
  <>
    <h1>Sign up</h1>
    <SignUpForm/>
  </>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  onSubmit = event => {
    const {username, email, passwordOne} = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
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
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";
    const {t} = this.props;

    return (
      <Form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder={t("signUp:Full Name")}
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder={t("signUp:Email Address")}
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder={t("signUp:Password")}
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder={t("signUp:Confirm Password")}
        />

        <button type="submin" disabled={isInvalid}>
          {t("signUp:Sign Up")}
        </button>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

const SignUpLink = withTranslation()(({t}) => (
  <p>
    {t("signUp:Don't have an account?")} <Link to={ROUTES.SIGN_UP}>{t("signUp:Sign Up")}</Link>
  </p>
));

const SignUpForm = compose(
  withRouter,
  withFirebase,
  withTranslation()
)(SignUpFormBase);

export default SignInUpPage;
export {SignUpForm, SignUpLink};
