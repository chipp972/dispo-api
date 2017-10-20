import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem
} from 'reactstrap';

export default class AdminScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList: ['job1', 'job2'],
      unavailableSwitchingDelay: 0,
      newConf: ''
    };

    this.props.socket.on('ADMIN_CONFIG_UPDATE', conf =>
      this.setState({ unavailableSwitchingDelay: conf })
    );

    this.props.socket.emit('GET_ADMIN_CONFIG');

    this.handleConfChange = this.handleConfChange.bind(this);
  }

  handleConfChange(event) {
    this.setState({ newConf: event.target.value });
  }

  render() {
    return (
      <Form>
        <Label for="unavailableSwitchingDelay">unavailableSwitchingDelay</Label>
        <Input
          id="unavailableSwitchingDelay"
          type="text"
          value={this.state.newConf}
          onChange={this.handleConfChange}
        />

        <ListGroup type="select">
          {this.state.jobList.map(job => (
            <ListGroupItem className="justify-content-between">
              {job + ' '}
              <Button color="info">Modifier</Button>{' '}
              <Button color="danger">Supprimer</Button>
            </ListGroupItem>
          ))}
        </ListGroup>

        <Button
          color="primary"
          size="lg"
          onClick={() =>
            this.props.socket.emit('SET_ADMIN_CONFIG', this.state.newConf)}
        >
          SET ADMIN
        </Button>{' '}

        <Button
          color="secondary"
          size="lg"
          onClick={() => this.props.socket.emit('GET_ADMIN_CONFIG')}
        >
          GET ADMIN
        </Button>

        <div>{this.state.unavailableSwitchingDelay}</div>
      </Form>
    );
  }
}
