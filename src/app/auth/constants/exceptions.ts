export default {
  bad_request: {
    http_code: 400,
    title: '[AUTH] BAD_REQUEST',
    message: 'The data is incorrect',
  },
  not_found: {
    http_code: 404,
    title: '[AUTH] NOT_FOUND',
    message: 'The data not found',
  },
  not_captcha: {
    http_code: 404,
    title: '[AUTH] NOT_FOUND',
    message: 'AUTH-NO-CAPTCHA',
  },
  not_auth: {
    http_code: 401,
    title: '[AUTH] NOT_AUTH',
    message: 'AUTH-NO-SIGIN',
  },
  user_inactive: {
    http_code: 401,
    title: '[AUTH] USER_INACTIVE',
    message: 'AUTH-INACTIVE',
  },
  duplicated: {
    http_code: 409,
    title: '[AUTH] DUPLICATED',
    message: 'AUTH-NO-REGISTER-EMAIL',
  },
  duplicatedCode: {
    http_code: 409,
    title: '[AUTH] DUPLICATED',
    message: 'AUTH-NO-REGISTER-CODE',
  },
  error_save: {
    http_code: 500,
    title: '[AUTH] ERROR_SAVE',
    message: 'Error to save',
  },
  error_find: {
    http_code: 500,
    title: '[AUTH] ERROR _FIND',
    message: 'Error to find',
  },
  error_update: {
    http_code: 500,
    title: '[AUTH] ERROR _UPDATE',
    message: 'Error to update',
  },
  error_delete: {
    http_code: 500,
    title: '[AUTH] ERROR _DELETE',
    message: 'Error to delete',
  },
  password_expired: {
    http_code: 401,
    title: '[AUTH] PASSWORD_EXPIRED',
    message: 'AUTH-PASSWORD-EXPIRED',
  },
};

