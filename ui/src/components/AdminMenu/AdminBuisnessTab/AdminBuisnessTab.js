// @flow
import React, { Component, SyntheticEvent } from 'react';
import { Button, Select, MenuItem, Input } from 'material-ui';
import type {
  Company,
  CompanyData
} from '../../../../../src/api/company/company.type';
import type { CompanyType } from '../../../../../src/api/companytype/companytype.type';
import type { User } from '../../../../../src/api/user/user.type';

type AdminBuisnessTabProps = {
  companyOperations: any,
  companyTypeOperations: any,
  userOperations: any
};

type AdminBuisnessTabState = {
  companies: Company[],
  companyTypes: CompanyType[],
  users: User[],
  owner: string,
  name: string,
  type: string,
  siret: string,
  imageUrl: string,
  address: string,
  phoneNumber: string
  // company: CompanyData
};

export default class AdminBuisnessTab extends Component<
  AdminBuisnessTabProps,
  AdminBuisnessTabState
> {
  constructor(props: AdminBuisnessTabProps) {
    super(props);
    this.state = {
      companyTypes: [],
      companies: [],
      users: [],
      owner: '',
      name: 'company01',
      type: '',
      siret: '1234561o901234',
      imageUrl:
        'https://assets-cdn.github.com/images/modules/open_graph/github-mark.png',
      address: '6 rue du havre 75009 Paris',
      phoneNumber: '0698310966'
    };
    this.handleCompaniesRefresh();
    this.handleCompanyTypesRefresh();
    this.handleUserRefresh();
  }

  /**
   * refresh companies in state
   */
  handleCompaniesRefresh = () => {
    this.props.companyOperations
      .getAll()
      .then((companies: Company[]) => {
        console.log('companies');
        console.log(companies);
        if (companies) this.setState({ companies });
      })
      .catch((err) => console.log(err));
  };

  handleCompanyTypesRefresh = () => {
    this.props.companyTypeOperations
      .getAll()
      .then((companyTypes: CompanyType[]) => {
        console.log('companyTypes');
        console.log(companyTypes);
        if (companyTypes) this.setState({ companyTypes });
      })
      .catch((err) => console.log(err));
  };

  handleUserRefresh = () => {
    this.props.userOperations
      .getAll()
      .then((users: User[]) => {
        console.log('users');
        console.log(users);
        if (users) this.setState({ users });
      })
      .catch((err) => console.log(err));
  };

  handleInputChange = (event: SyntheticEvent, name?: string) => {
    const { target } = event;
    this.setState({
      [name || target.name]:
        target.type === 'checkbox' ? target.checked : target.value
    });
  };

  render() {
    return (
      <form>
        <label>
          owner
          <Select
            value={this.state.owner}
            onChange={(event) => this.handleInputChange(event, 'owner')}
            input={<Input name="owner" />}
          >
            {this.state.users.map((user: User) => (
              <MenuItem key={user._id} value={user._id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
        </label>
        <label>
          company name
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          company type
          <Select
            value={this.state.type}
            onChange={(event) => this.handleInputChange(event, 'type')}
            input={<Input name="type" />}
          >
            {this.state.companyTypes.map((type: CompanyType) => (
              <MenuItem key={type._id} value={type._id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </label>
        <label>
          siret
          <input
            type="text"
            name="siret"
            maxLength="14"
            minLength="14"
            value={this.state.siret}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          imageUrl
          <input
            type="text"
            name="imageUrl"
            value={this.state.imageUrl}
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
            this.props.companyOperations
              .create({
                owner: this.state.owner,
                name: this.state.name,
                type: this.state.type,
                siret: this.state.siret,
                imageUrl: this.state.imageUrl,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber
              })
              .then((res) => console.log(res))
              .then(() => this.handleCompaniesRefresh())
              .catch((err) => console.log(err));
          }}
        >
          CREATE COMPANY
        </Button>
        <Button
          raised
          color="primary"
          onClick={() => {
            this.handleCompaniesRefresh();
            this.handleCompanyTypesRefresh();
            this.handleUserRefresh();
          }}
        >
          REFRESH
        </Button>

        <div>
          {this.state.companies.map((company) => (
            <div key={company._id}>
              <img src={company.imageUrl} alt={company.name} />
              {company.name}
            </div>
          ))}
        </div>
      </form>
    );
  }
}
