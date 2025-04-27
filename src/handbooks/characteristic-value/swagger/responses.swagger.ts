export const create201 = {
  data: {
    property_characteristic_uuid: '99a04bd2-c137-4ffc-864c-a60db361556a',
    value: 'Централізоване',
    uuid: '4cba9a78-2973-471b-88e0-e585f638309f',
    createdAt: '2025-04-14T15:42:56.062Z',
  },
  message: 'Created',
  statusCode: 201,
};

export const create400 = {
  errors: {
    value: ['value should not be empty'],
  },
  error: 'Bad Request',
  statusCode: 400,
};

export const create404 = {
  message: 'Характеристика не існує або видалена',
  error: 'Not Found',
  statusCode: 404,
};

export const create422 = {
  message: 'Значення для характеристики вже існує',
  error: 'Unprocessable Entity',
  statusCode: 422,
};

export const get200 = {
  data: [
    {
      uuid: 'a371ecd6-2b56-4432-a05d-877d1b979a16',
      property_characteristic_uuid: '99a04bd2-c137-4ffc-864c-a60db361556a',
      value: 'Автономне газове',
      createdAt: '2025-04-26T18:12:45.054Z',
    },
    {
      uuid: '801a98f6-6349-42ef-9262-217349766d14',
      property_characteristic_uuid: '99a04bd2-c137-4ffc-864c-a60db361556a',
      value: 'Централізоване',
      createdAt: '2025-04-26T18:13:12.129Z',
    },
    {
      uuid: '907457f3-3015-41bb-bcad-87a26b139677',
      property_characteristic_uuid: '99a04bd2-c137-4ffc-864c-a60db361556a',
      value: 'Електричне',
      createdAt: '2025-04-26T18:13:36.397Z',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const getByUuid200 = {
  data: {
    uuid: 'a371ecd6-2b56-4432-a05d-877d1b979a16',
    property_characteristic_uuid: '99a04bd2-c137-4ffc-864c-a60db361556a',
    value: 'Автономне газове',
    createdAt: '2025-04-26T18:12:45.054Z',
  },
  message: 'Success',
  statusCode: 200,
};

export const getArchive200 = {};

export const update422 = {};
