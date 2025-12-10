export default {
  bad_request: {
    http_code: 400,
    title: '[PRODUCT] BAD_REQUEST',
    message: 'The data is incorrect',
  },
  not_found: {
    http_code: 404,
    title: '[PRODUCT] NOT_FOUND',
    message: 'The data not found',
  },
  duplicated: {
    http_code: 409,
    title: '[PRODUCT] DUPLICATED',
    message: 'PRODUCT-FAIL-CODE',
  },
  duplicatedCode: {
    http_code: 409,
    title: '[PRODUCT] DUPLICATED',
    message: 'PRODUCT-FAIL-CODE',
  },
  error_save: {
    http_code: 500,
    title: '[PRODUCT] ERROR_SAVE',
    message: 'PRODUCT-NEW-FAIL',
  },
  error_find: {
    http_code: 500,
    title: '[PRODUCT] ERROR _FIND',
    message: 'Error to find',
  },
  error_update: {
    http_code: 500,
    title: '[PRODUCT] ERROR _UPDATE',
    message: 'PRODUCT-EDIT-FAIL',
  },
  error_delete: {
    http_code: 500,
    title: '[PRODUCT] ERROR _DELETE',
    message: 'PRODUCT-INACTIVE-FAIL',
  },
};

