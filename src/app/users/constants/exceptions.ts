export default {
  bad_request: {
    http_code: 400,
    title: '[USER] BAD_REQUEST',
    message: 'The data is incorrect',
  },
  not_found: {
    http_code: 404,
    title: '[USER] NOT_FOUND',
    message: 'The data not found',
  },
  duplicated: {
    http_code: 409,
    title: '[USER] DUPLICATED',
    message: 'USER-FAIL-EMAIL',
  },
  duplicatedCode: {
    http_code: 409,
    title: '[AUTH] DUPLICATED',
    message: 'USER-FAIL-CODE',
  },
  error_save: {
    http_code: 500,
    title: '[USER] ERROR_SAVE',
    message: 'USER-NEW-FAIL',
  },
  error_find: {
    http_code: 500,
    title: '[USER] ERROR _FIND',
    message: 'Error to find',
  },
  error_update: {
    http_code: 500,
    title: '[USER] ERROR _UPDATE',
    message: 'USER-EDIT-FAIL',
  },
  error_delete: {
    http_code: 500,
    title: '[USER] ERROR _DELETE',
    message: 'USER-INACTIVE-FAIL',
  },
  error_password: {
    http_code: 404,
    title: '[USER] INCORRECT PASSWORD',
    message: ' USER-INCORRECT-PASSWORD',
  },
};

