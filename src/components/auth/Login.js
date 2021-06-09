import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
const { LOGIN_USER } = Mutations;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };

    this.signupRedirect = this.signupRedirect.bind(this);
    // this.handleDemoUser = this.handleDemoUser.bind(this);
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    client.writeData({
      data: { isLoggedIn: data.login.loggedIn, currentUser: data.login._id }
    });
  }

  signupRedirect() {
    this.props.history.push("/register");
  }

  render() {
    return (
      <div className="auth-page-container">
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={data => {
            const { token } = data.login;
            localStorage.setItem("currentUser", data.login._id);
            localStorage.setItem("auth-token", token);
            this.props.history.push("/");
          }}
          update={(client, data) => this.updateCache(client, data)}
          onError={error => {
            console.log("ERROR in SigninBox ", { error });
          }}
        >
          {(loginUser, { error }) => (
            <div className="login">
              <div className="signup-header">
              </div>
              <div className="content-login-1">
                <form
                  className="form"
                  onSubmit={e => {
                    e.preventDefault();
                    loginUser({
                      variables: {
                        email: this.state.email,
                        password: this.state.password
                      }
                    });
                  }}
                >
                  <br />
                  <br />
                  <label>
                    <input
                      value={this.state.email}
                      onChange={this.update("email")}
                      className="input-register-2"
                      placeholder="Email"
                    />
                  </label>
                  <br />
                  <label>
                    <input
                      value={this.state.password}
                      onChange={this.update("password")}
                      className="input-register-2"
                      type="password"
                      placeholder="Пароль"
                    />
                    {error ? (
                      <div className="input-error">
                        {error.graphQLErrors[0].message}
                      </div>
                    ) : (
                      <div style={{ display: "none" }}>{null}</div>
                    )}
                  </label>
                  <br />
                  <button type="submit" className="login-submit">
                    Войти в аккаунт
                  </button>
                </form>
                <span id="no-account-q">У вас нет учетной записи?</span>
                <button
                  type="submit"
                  className="signup-button"
                  onClick={this.signupRedirect}
                >
                    Зарегистрироваться
                </button>
              </div>
            </div>
          )}
        </Mutation>
      </div>
    );
  }
}

export default Login;