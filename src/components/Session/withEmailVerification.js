import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";

const withEmailVerification = Component => {
  class withEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return needsEmailVerification(this.props.sessionStore.authUser) ? (
        <div>
          {this.state.isSent ? (
            <p>
              E-mail confirmation sent: Check your E-Mails (Spam folder
              included) for a confirmation E-mail. Refresh this page once you
              confirmed your E-mail.
            </p>
          ) : (
            <p>
              Verify your E-mail: Check your E-Mails (Spam folder included) for
              a confirmation E-mail or send another confirmation E-mail
            </p>
          )}
          <button
            type="buttone"
            onClick={this.onSendEmailVerification}
            disabled={this.state.isSent}
          >
            Send confirmation E.mail
          </button>
        </div>
      ) : (
        <Component {...this.props} />
      );
    }
  }

  return compose(
    withFirebase,
    inject("sessionStore"),
    observer
  )(withEmailVerification);
};

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes("password");

export default withEmailVerification;
