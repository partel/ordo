import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */
    this.serverValue = app.database.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.auth = app.auth();
    this.db = app.firestore();
    this.files = app.storage().ref()
  }

  //*** Auth API **//
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    });

  //*** User API **//
  user = uid => this.db.collection("users").doc(uid);
  users = () => this.db.collection("users");

  //*** Company API **//
  company = code => this.db.collection("companies").doc(code);
  companies = () => this.db.collection("companies");

  //*** Order API **//
  order = uid => this.db.collection("orders").doc(uid);
  orders = () => this.db.collection("orders");
  ordersByCompany = (companyCode) => this.orders().where("company", "==", companyCode);

  //*** Files API **///
  upload = file => {
    const ref = this.files.child(file.name);
    return ref.put(file);
  };


  //*** Merge Auth and DB User API **//
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid).get()
          .then(snapshot => {
            const dbUser = snapshot.exists ? snapshot.data() : {};

            //default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }
            
            //merge auth and db users
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser
            };

            //enrich auth user with company data
            if (authUser.companyCode) {
              this.company(dbUser.companyCode).get()
                .then(snapshot => {
                  authUser.companyName = snapshot.exists ? snapshot.data().name : "";
                });
            }

            next(authUser);
          });
      } else {
        fallback();
      }
    });
}

export default Firebase;
