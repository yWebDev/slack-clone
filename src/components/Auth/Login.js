import React from "react";
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

class Login extends React.Component {
  state = {
    email: "",
    password: "",
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
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(signedUser => {
          console.log(signedUser);
          this.setState({ loading: false });
      })
      .catch(this.errorHandler)
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

  isFormEmpty = ({ email, password }) => {
    return !email.length || !password.length;
  };

  isPasswordInvalid = ({ password }) => {
    if (password.length < 6) {
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
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to DevChat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
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

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="violet"
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
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
