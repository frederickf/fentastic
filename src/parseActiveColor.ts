import { ParseError } from './ParseError.js'
import { type Field } from './createFields.js'

const fieldName = 'Active color'
export const validateActiveColor = (field: Field): Field => {
  try {
    if (field.tokens.length !== 1) {
      throw new ParseError(fieldName, field.tokens.length, field.tokens[0].index, '1', 'field length to be')
    }
  
    if (field.value !== 'w' && field.value !== 'b') {
      throw new ParseError(fieldName, field.value, field.tokens[0].index, 'w|b')
    }
  }
  catch (e) {
    if (e instanceof ParseError) {
      field.error = e
    } 
    else {
      throw e
    }
  }

  return field
}

// TODO: This seems unnecessary. Can't I just use the original w or b?
export const parseActiveColor = (field: Field): 'white' | 'black' => {
  return field.value === 'w' ? 'white' : 'black'
}