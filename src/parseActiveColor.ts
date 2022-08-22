import { ParseError } from './ParseError.js'
import { type Field } from './createFields.js'

const fieldName = 'Active color'
export const validateActiveColor = (field: Field): Field => {
  try {
    if (field.tokens.length !== 1) {
      throw new ParseError(
        `${fieldName}: Expected 1 character, instead found ${field.tokens.length} at ${field.tokens[0].position}`,
        field.tokens[0].position
      )
    }
  
    if (field.value !== 'w' && field.value !== 'b') {
      throw new ParseError(
        `${fieldName}: Expected "w|b", instead found ${field.value} at ${field.tokens[0].position}`,
        field.tokens[0].position
      )
    }
  } catch (e) {
    if (e instanceof ParseError) {
      field.error = e
    } 
    else {
      throw e
    }
  }

  return field;
}

// TODO: This seems unnecessary. Can't I just use the original w or b?
export const parseActiveColor = (field: Field): 'white' | 'black' => {
  return field.value === 'w' ? 'white' : 'black'
}