// @flow
import React from 'react';
import type { User, UserData } from '../../../../src/api/user/user.type';
import Form from '../Form/Form';
import type { InputDescription } from '../Form/Form';
import type { CrudOperations } from '../../api/api';

const inputs: InputDescription[] = [
  { id: 'email', label: 'Adresse e-mail', type: 'text' },
  { id: 'password', label: 'Mot de passe', type: 'password' },
  { id: 'lastName', label: 'Nom', type: 'text' },
  { id: 'firstName', label: 'Prenom', type: 'text' },
  { id: 'birthDate', label: 'Date de naissance', type: 'date' },
  { id: 'phoneNumber', label: 'Numero de telephone', type: 'text' },
  { id: 'address', label: 'Adresse', type: 'text' }
];

type UserFormProps = {
  usersRefresh: Function,
  userOperations: CrudOperations<UserData, User>
};

const UserForm = (props: UserFormProps) => (
  <Form
    initialState={{
      email: '',
      password: '',
      lastName: '',
      firstName: '',
      birthDate: '1995-01-01',
      phoneNumber: '06',
      address: ''
    }}
    inputs={inputs}
    onSubmit={(formData) => {
      props.userOperations
        .create(formData)
        .then((res) => console.log(res))
        .then(() => props.usersRefresh())
        .catch((err) => console.log(err));
    }}
    onSubmitLabel="CREER UN UTILISATEUR"
  />
);

export default UserForm;
