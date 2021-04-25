// errorKey => can be used as keys on i18n (on client side)
// message => for information only

const errors = {
  GeneralError: {
    message: 'Something went wrong! (contact backend)',
    errorKey: 'GeneralError',
    statusCode: 500
  },
  TodoGeneralError: {
    message: 'Todo: Something went wrong!',
    errorKey: 'TodoGeneralError',
    statusCode: 500
  },
}

module.exports = { errors }
