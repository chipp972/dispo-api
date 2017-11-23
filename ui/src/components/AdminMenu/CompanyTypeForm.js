// @flow
import React from 'react';
import type {
  CompanyType,
  CompanyTypeData
} from '../../../../src/api/companytype/companytype.type';
import type { CrudOperations } from '../../api/api';
import Form from '../Form/Form';

type CompanyTypeFormProps = {
  companyTypeOperations: CrudOperations<CompanyTypeData, CompanyType>,
  companyTypesRefresh: Function
};

const CompanyTypeForm = (props: CompanyTypeFormProps) => (
  <Form
    initialState={{ name: '' }}
    inputs={
  [{ id: 'name', label: 'Type d\'entreprise', type: 'text' }]
}
    onSubmit={(formData) => {
      props.companyTypeOperations
        .create(formData)
        .then((res) => console.log(res))
        .then(() => props.companyTypesRefresh())
        .catch((err) => console.log(err));
    }}
    onSubmitLabel="CREER UN TYPE D'ENTREPRISE"
  />
);

export default CompanyTypeForm;
