// @flow
import React, { Component, SyntheticEvent } from 'react';
import { TextField, Button } from 'material-ui';
import type { User } from '../../../../src/api/user/user.type';

type UserFormProps = {
  userOperations: any
};

type UserFormState = {
  users: User[],
  email: string,
  password: string,
  lastName: string,
  firstName: string,
  birthDate: string,
  phoneNumber: string,
  address: string
};

export default class UserForm extends Component<UserFormProps, UserFormState> {
  constructor(props: UserFormProps) {
    super(props);
    this.state = {
      users: [],
      email: '',
      password: '',
      lastName: '',
      firstName: '',
      birthDate: '1995-01-01',
      phoneNumber: '06',
      address: ''
    };
    this.handleUserRefresh();
  }

  handleInputChange = (event: SyntheticEvent) => {
    const { target } = event;
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    });
  };

  handleUserRefresh = () => {
    this.props.userOperations.getAll().then((users) => this.setState({ users }));
  };

  render() {
    return (
      <form>
        <label>
          email
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          password
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
        </label>
        <TextField
          name="birthDate"
          label="birthDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={this.state.birthDate}
          onChange={this.handleInputChange}
        />
        <label>
          lastName
          <input
            type="text"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          firstName
          <input
            type="text"
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          address
          <input
            type="text"
            name="address"
            value={this.state.address}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          phoneNumber
          <input
            type="text"
            name="phoneNumber"
            value={this.state.phoneNumber}
            onChange={this.handleInputChange}
          />
        </label>
        <Button
          raised
          color="primary"
          onClick={() => {
            this.props.userOperations
              .create({
                email: this.state.email,
                password: this.state.password,
                lastName: this.state.lastName,
                firstName: this.state.firstName,
                birthDate: this.state.birthDate,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address
              })
              .then((res) => console.log(res))
              .then(() => this.handleUserRefresh())
              .catch((err) => console.log(err));
          }}
        >
          CREATE USER
        </Button>
        {this.state.users.map((user: User) => (
          <div key={user._id}>{user.email}</div>
        ))}
      </form>
    );
  }
}
