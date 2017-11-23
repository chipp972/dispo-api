// @flow
import React from 'react';
import { Select, InputLabel, MenuItem, Input, TextField } from 'material-ui';
import type { InputDescription } from './Form';

interface FormInputProps extends InputDescription {
  selectOptions: Array<{ _id: string, label: string }>;
  handleInputChange: string => any;
  value: string;
}

const FormInput = ({
  id,
  label,
  type,
  helperText,
  selectOptions,
  handleInputChange,
  value
}: FormInputProps) => {
  switch (type) {
    case 'select':
      return [
        <InputLabel key={`inputlabel_${id}`} htmlFor={id}>
          {label}
        </InputLabel>,
        <Select
          key={id}
          value={value}
          onChange={handleInputChange(id)}
          input={<Input id={id} />}
        >
          {selectOptions.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ];
    default:
      return (
        <TextField
          id={id}
          label={label}
          type={type}
          value={value}
          onChange={handleInputChange(id)}
          margin="normal"
        />
      );
  }
};

export default FormInput;
