export default {
  bad_request: {
    http_code: 400,
    title: '[INVENTORY_COUNT] BAD_REQUEST',
    message: 'The data is incorrect',
  },
  not_found: {
    http_code: 404,
    title: '[INVENTORY_COUNT] NOT_FOUND',
    message: 'The data not found',
  },
  duplicated: {
    http_code: 409,
    title: '[INVENTORY_COUNT] DUPLICATED',
    message: 'INVENTORY_COUNT-FAIL-CODE',
  },
  duplicatedCode: {
    http_code: 409,
    title: '[INVENTORY_COUNT] DUPLICATED',
    message: 'INVENTORY_COUNT-FAIL-CODE',
  },
  error_save: {
    http_code: 500,
    title: '[INVENTORY_COUNT] ERROR_SAVE',
    message: 'INVENTORY_COUNT-NEW-FAIL',
  },
  error_find: {
    http_code: 500,
    title: '[INVENTORY_COUNT] ERROR _FIND',
    message: 'Error to find',
  },
  error_update: {
    http_code: 500,
    title: '[INVENTORY_COUNT] ERROR _UPDATE',
    message: 'INVENTORY_COUNT-EDIT-FAIL',
  },
  error_delete: {
    http_code: 500,
    title: '[INVENTORY_COUNT] ERROR _DELETE',
    message: 'INVENTORY_COUNT-INACTIVE-FAIL',
  },
};

