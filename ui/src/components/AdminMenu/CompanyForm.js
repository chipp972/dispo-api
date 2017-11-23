// @flow
import React from 'react';
import type {
  Company,
  CompanyData
} from '../../../../src/api/company/company.type.js';
import type { CompanyType } from '../../../../src/api/companytype/companytype.type';
import type { User } from '../../../../src/api/user/user.type';
import type { CrudOperations } from '../../api/api';
import Form from '../Form/Form';
import type { InputDescription } from '../Form/Form';

type CompanyFormProps = {
  companyTypes: CompanyType[],
  users: User[],
  companyOperations: CrudOperations<CompanyData, Company>,
  companiesRefresh: Function
};

const initialState = {
  owner: '',
  name: 'company01',
  type: '',
  siret: '1234561o901234',
  imageUrl:
    'https://assets-cdn.github.com/images/modules/open_graph/github-mark.png',
  address: '6 rue du havre 75009 Paris',
  phoneNumber: '0698310966'
};

const inputs: InputDescription[] = [
  { id: 'owner', label: 'Gerant', type: 'select' },
  { id: 'name', label: "Nom de l'entreprise", type: 'text' },
  { id: 'type', label: 'Type', type: 'select' },
  { id: 'siret', label: 'Siret', type: 'text' },
  { id: 'imageUrl', label: 'image', type: 'text' },
  { id: 'address', label: 'Adresse', type: 'text' },
  { id: 'phoneNumber', label: 'Numero de telephone', type: 'text' }
];

const CompanyForm = (props: CompanyFormProps) => (
  <Form
    initialState={initialState}
    inputs={inputs}
    selectOptions={{
      owner: props.users.map((user) => ({ _id: user._id, label: user.email })),
      type: props.companyTypes.map((type) => ({
        _id: type._id,
        label: type.name
      }))
    }}
    onSubmit={(formData) => {
      props.companyOperations
        .create(formData)
        .then((res) => console.log(res))
        .then(() => props.companiesRefresh())
        .catch((err) => console.log(err));
    }}
    onSubmitLabel="CREER UNE ENTREPRISE"
  />
);

export default CompanyForm;
