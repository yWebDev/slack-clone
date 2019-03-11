import React from "react";
import md5 from "md5";
import firebase from "../../firebase";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    userRefs: firebase.database().ref("users")
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.isFormValid()) {
      return;
    }

    this.setState({ loading: true });

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        return createdUser.user
          .updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(
              createdUser.user.email
            )}?d=identicon`
          })
          .then(() => this.saveUser(createdUser))
          .then(() => {
            this.setState({ loading: false });
            console.log("user is saved");
          })
          .catch(this.errorHandler);
      })
      .catch(this.errorHandler);
  };

  errorHandler = err => {
    console.error(err);
    this.setState({ errors: [err.message], loading: false });
  };

  isFormValid = () => {
    if (this.isFormEmpty(this.state)) {
      const error = "Fill all fields";
      this.setState(() => ({ errors: [error] }));
      return false;
    } else if (this.isPasswordInvalid(this.state)) {
      const error = "Password is invalid";
      this.setState(() => ({ errors: [error] }));
      return false;
    } else {
      this.setState(() => ({ errors: [] }));
      return true;
    }
  };

  isFormEmpty = ({ email, username, password, passwordConfirmation }) => {
    return (
      !email.length ||
      !username.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordInvalid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return true;
    }

    if (password !== passwordConfirmation) {
      return true;
    }

    return false;
  };

  displayErrors = () => {
    return this.state.errors.map((error, i) => <p key={i}>{error}</p>);
  };

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  saveUser = createdUser => {
    return this.state.userRefs.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
                value={username}
                onChange={this.handleChange}
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                type="email"
                value={email}
                className={this.handleInputError(errors, "email")}
                onChange={this.handleChange}
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                className={this.handleInputError(errors, "password")}
                onChange={this.handleChange}
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                type="password"
                value={passwordConfirmation}
                className={this.handleInputError(errors, "password")}
                onChange={this.handleChange}
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {!!errors.length && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
