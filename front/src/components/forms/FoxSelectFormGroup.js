import React from 'react'

import {
  CFormGroup,
  CLabel,
  CSelect
} from '@coreui/react'

const makeLabel = inputString => {
  return inputString.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
const makePlaceholder = inputString => {
  return `Choose ${makeLabel(inputString)} info`
}


const FoxSelectFormGroup = props => {
  return (
    <CFormGroup>
      <CSelect
        id={props.inputInfo}
        name={props.inputInfo}
        placeholder={makePlaceholder(props.inputInfo)}
        value={props.inputValue}
        onChange={props.handleChange}
        required
      >
        {props.options.map((option) => {
          return (
            <option key={option.id} value={option.id}>{option.position}</option>
          )
        }
        )}
      </CSelect>
    </CFormGroup>
  )
}

export default FoxSelectFormGroup