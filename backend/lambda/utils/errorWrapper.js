const{ errors } = require('./errors')
const{ responseMapper } = require('./responseMapper')

const ErrorWrapper = (errorKey) => {
  try{
    let error = errors[errorKey.message]

    if(!error){
      // in case errorKey isn't correct
      throw new Error('Bad Key')
    }
    return errorResponseMapper(error)

  } catch(e){
    console.log('BAD Key', errorKey, 'error', e)
    // default error
    return errorResponseMapper(errors['GeneralError'])
  }
}

const errorResponseMapper = (error) =>{
  return responseMapper(error.statusCode, error)
}

module.exports = {
  ErrorWrapper,
}
