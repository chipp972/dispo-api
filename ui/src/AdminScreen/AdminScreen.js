import React, { Component } from 'react';
import {
  Button,
  Form,
  Label,
  Input,
  ListGroup,
  ListGroupItem
} from 'reactstrap';

const createCompany = () =>
  fetch('/company', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'company01',
      imageUrl:
        'https://assets-cdn.github.com/images/modules/open_graph/github-mark.png',
      siret: '1234561o901234',
      address: '6 rue du havre 75009 Paris',
      phoneNumber: '0698310966'
    })
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err));

const getAllCompanies = () =>
  new Promise((resolve, reject) => {
    fetch('/company', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });

export default class AdminScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList: ['job1', 'job2'],
      unavailableSwitchingDelay: 0,
      newConf: '',
      companies: []
    };

    this.props.socket.on('news', text => console.log(text));

    // this.props.socket.on('ADMIN_CONFIG_UPDATE', conf =>
    //   this.setState({ unavailableSwitchingDelay: conf })
    // );

    this.props.socket.on('ADMIN_CONFIG_UPDATE', text => console.log(text));

    this.handleConfChange = this.handleConfChange.bind(this);
    this.handleCompaniesRefresh = this.handleCompaniesRefresh.bind(this);
  }

  handleConfChange(event) {
    this.setState({ newConf: event.target.value });
  }

  handleCompaniesRefresh() {
    getAllCompanies()
      .then(companies => {
        console.log(companies);
        if (companies) this.setState({ companies });
      })
      .catch(err => console.log(err));
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
            <ListGroupItem key={job} className="justify-content-between">
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
        <Button
          color="primary"
          onClick={async () => {
            await createCompany();
            await this.handleCompaniesRefresh();
          }}
        >
          CREATE COMPANY
        </Button>
        <Button color="primary" onClick={() => this.handleCompaniesRefresh()}>
          REFRESH COMPANIES
        </Button>
        <div>{this.state.unavailableSwitchingDelay}</div>
        <div>
          {this.state.companies.map(company => (
            <div key={company._id}>
              <img src={company.imageUrl} alt={company.name} />
              {company.name}
            </div>
          ))}
        </div>
      </Form>
    );
  }
}
