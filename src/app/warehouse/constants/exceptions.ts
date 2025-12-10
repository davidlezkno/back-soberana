export default {
  bad_request: {
    http_code: 400,
    title: '[WAREHOUSE] BAD_REQUEST',
    message: 'The data is incorrect',
  },
  not_found: {
    http_code: 404,
    title: '[WAREHOUSE] NOT_FOUND',
    message: 'The data not found',
  },
  duplicated: {
    http_code: 409,
    title: '[WAREHOUSE] DUPLICATED',
    message: 'WAREHOUSE-FAIL-CODE',
  },
  duplicatedCode: {
    http_code: 409,
    title: '[WAREHOUSE] DUPLICATED',
    message: 'WAREHOUSE-FAIL-CODE',
  },
  error_save: {
    http_code: 500,
    title: '[WAREHOUSE] ERROR_SAVE',
    message: 'WAREHOUSE-NEW-FAIL',
  },
  error_find: {
    http_code: 500,
    title: '[WAREHOUSE] ERROR _FIND',
    message: 'Error to find',
  },
  error_update: {
    http_code: 500,
    title: '[WAREHOUSE] ERROR _UPDATE',
    message: 'WAREHOUSE-EDIT-FAIL',
  },
  error_delete: {
    http_code: 500,
    title: '[WAREHOUSE] ERROR _DELETE',
    message: 'WAREHOUSE-INACTIVE-FAIL',
  },
};

