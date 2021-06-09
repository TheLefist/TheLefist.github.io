import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import { Link } from "react-router-dom";

const { REGISTER_USER, LOGIN_USER } = Mutations;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: ""
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    client.writeData({
      data: { isLoggedIn: data.register.loggedIn, currentUser: data.register._id }
    });
  }

  updateDemoCache(client, { data }) {
    client.writeData({
      data: { isLoggedIn: data.login.loggedIn, currentUser: data.login._id }
    });
  }

  render() {
    return (
      <div className="auth-page-container">
      <Mutation
        mutation={REGISTER_USER}
        onCompleted={data => {
          const { token } = data.register;
          localStorage.setItem("currentUser", data.register._id);
          localStorage.setItem("auth-token", token);
        }}
        update={(client, data) => this.updateCache(client, data)}
        onError={error => {
          console.log("ERROR in SignupBox ", { error });
        }}
      >
        {(registerUser, { error }) => (
          <div className="signup">
            <div className="signup-header">
            </div>
            <div className="content">
              <Mutation
                mutation={LOGIN_USER}
                onCompleted={data => {
                  const { token } = data.login;
                  localStorage.setItem("auth-token", token);
                  this.props.history.push("/");
                }}
                update={(client, data) => this.updateDemoCache(client, data)}
              >
              </Mutation>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  registerUser({
                    variables: {
                      name: this.state.name,
                      email: this.state.email,
                      password: this.state.password
                    }
                  });
                }}
              >
                <br />
                <div className="login-form">
                  <br />
                  <label>
                    <input
                      value={this.state.name}
                      onChange={this.update("name")}
                      className="input-register-1"
                      placeholder="Имя"
                    />
                  </label>
                  <br />
                  <label>
                    <input
                      value={this.state.email}
                      onChange={this.update("email")}
                      className="input-register-1"
                      placeholder="Email"
                    />
                  </label>
                  <br />
                  <label>
                    <input
                      value={this.state.password}
                      onChange={this.update("password")}
                      className="input-register-1"
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
                  <button type="submit" className="signup-submit">
                    Зарегистрироваться
                  </button>
                  <div className="login-prompt">
                    У вас уже есть учетная запись?
                    <Link id="login-highlight" to="/login">
                      Войти
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </Mutation>
      </div>
    );
  }
}

export default Register;