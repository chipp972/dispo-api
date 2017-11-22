// @flow
import React, { Component, SyntheticEvent } from 'react';
import { Button } from 'material-ui';
import type { CompanyType } from '../../../../src/api/companytype/companytype.type';

type CompanyTypeFormProps = {
  companyTypeOperations: any
};

type CompanyTypeFormState = {
  companyTypes: CompanyType[],
  name: string
};

export default class CompanyTypeForm extends Component<
  CompanyTypeFormProps,
  CompanyTypeFormState
> {
  constructor(props: CompanyTypeFormProps) {
    super(props);
    this.state = { companyTypes: [], name: '' };
    this.handleCompanyTypeRefresh();
  }

  handleInputChange = (event: SyntheticEvent) => {
    const { target } = event;
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    });
  };

  handleCompanyTypeRefresh = () => {
    this.props.companyTypeOperations
      .getAll()
      .then((companyTypes) => this.setState({ companyTypes }));
  };

  render() {
    return (
      <form>
        <label>
          company type name
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
          />
        </label>
        <Button
          raised
          color="primary"
          onClick={() => {
            this.props.companyTypeOperations
              .create({
                name: this.state.name
              })
              .then((res) => console.log(res))
              .then(() => this.handleCompanyTypeRefresh())
              .catch((err) => console.log(err));
          }}
        >
          CREATE COMPANY TYPE
        </Button>
        {this.state.companyTypes.map(({ _id, name}) => <div key={_id}>{name}</div>)}
      </form>
    );
  }
}
