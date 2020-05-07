import React, { Component } from "react";
import { TextInputField } from "components/common";
import { Button } from "components/common";
import { AsyncRequest } from "lib";
import { endpoints } from "lib";
import { Messages } from "lib";
import { Notification } from "components/common";

export default class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      nameValue: "",
      emailValue: "",
      passwordValue: "",
      passwordConfirmationValue: "",
      apiMessages: "",
      clientMessages: "",
    };

    this.onTextFieldChange = this.onTextFieldChange.bind(this);
    this.signupUser = this.signupUser.bind(this);
  }

  signupUser(credentials) {
    this.setState({ isLoading: true });
    AsyncRequest.post(endpoints.users.create, credentials)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          this.props.authenticate(data);
        } else {
          this.setState({ apiMessages: data.messages });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ clientMessages: [Messages.connectionError] });
      })
      .finally(() => this.setState({ isLoading: false }));
  }

  onTextFieldChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  render() {
    const { toggleSignupForm } = this.props;
    const {
      nameValue,
      emailValue,
      passwordValue,
      passwordConfirmationValue,
      apiMessages,
      clientMessages,
    } = this.state;
    const isLoading = this.state.isLoading ? "is-loading" : "";
    return (
      <div>
        <form
          onSubmit={(e) => {
            this.signupUser({
              user: {
                name: nameValue,
                email: emailValue,
                password: passwordValue,
                password_confirmation: passwordConfirmationValue,
              },
            });
            e.preventDefault();
          }}
        >
          <div>
            {apiMessages &&
              apiMessages.map((notification, index) => (
                <Notification type={notification.type}>
                  <p>The following errors occurred:</p>
                  <ul>
                    {notification.message.split("\n").map((error) => (
                      <li>• {error}</li>
                    ))}
                  </ul>
                </Notification>
              ))}
            <div className="has-text-centered">
              {clientMessages &&
                clientMessages.map((notification, index) => (
                  <Notification type={notification.type}>
                    <p>{notification.message}</p>
                  </Notification>
                ))}
            </div>
          </div>
          <TextInputField
            label="Name:"
            name="nameValue"
            type="text"
            placeholder="Your Name"
            value={nameValue}
            onChange={this.onTextFieldChange}
          />
          <TextInputField
            label="Email:"
            name="emailValue"
            type="email"
            placeholder="your@email.com"
            value={emailValue}
            onChange={this.onTextFieldChange}
          />
          <TextInputField
            label="Password:"
            name="passwordValue"
            type="password"
            value={passwordValue}
            onChange={this.onTextFieldChange}
          />
          <TextInputField
            label="Password confirmation:"
            name="passwordConfirmationValue"
            type="password"
            value={passwordConfirmationValue}
            onChange={this.onTextFieldChange}
          />
          <div className="field">
            <div className="control">
              <Button classModifiers={"is-link " + isLoading}>Sign up</Button>
            </div>
          </div>
          <div>
            <p className="is-size-6">
              Already have an account? <a onClick={toggleSignupForm}>Log in.</a>
            </p>
          </div>
        </form>
      </div>
    );
  }
}
