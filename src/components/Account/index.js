import React from "react";
import {inject, observer} from "mobx-react";

import {compose} from "recompose";

import {withAuthorization, withEmailVerification} from "../Session";
import {PasswordForgetForm} from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import {withTranslation} from "react-i18next";

const AccountPage = ({sessionStore, t}) => (
  <>
    <h1>{t("account:Account")}: {sessionStore.authUser.email}</h1>
    <PasswordForgetForm/>
    <PasswordChangeForm/>
  </>
);

const condition = authUser => !!authUser;

export default compose(
  withTranslation(),
  inject("sessionStore"),
  observer,
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
