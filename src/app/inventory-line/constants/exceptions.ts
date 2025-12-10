export default {
  bad_request: {
    http_code: 400,
    title: '[INVENTORY_LINE] BAD_REQUEST',
    message: 'The data is incorrect',
  },
  not_found: {
    http_code: 404,
    title: '[INVENTORY_LINE] NOT_FOUND',
    message: 'The data not found',
  },
  duplicated: {
    http_code: 409,
    title: '[INVENTORY_LINE] DUPLICATED',
    message: 'INVENTORY_LINE-FAIL-CODE',
  },
  duplicatedCode: {
    http_code: 409,
    title: '[INVENTORY_LINE] DUPLICATED',
    message: 'INVENTORY_LINE-FAIL-CODE',
  },
  error_save: {
    http_code: 500,
    title: '[INVENTORY_LINE] ERROR_SAVE',
    message: 'INVENTORY_LINE-NEW-FAIL',
  },
  error_find: {
    http_code: 500,
    title: '[INVENTORY_LINE] ERROR _FIND',
    message: 'Error to find',
  },
  error_update: {
    http_code: 500,
    title: '[INVENTORY_LINE] ERROR _UPDATE',
    message: 'INVENTORY_LINE-EDIT-FAIL',
  },
  error_delete: {
    http_code: 500,
    title: '[INVENTORY_LINE] ERROR _DELETE',
    message: 'INVENTORY_LINE-INACTIVE-FAIL',
  },
};

