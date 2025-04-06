export const create201 = {
  data: {
    name: 'Євро',
    code: 'EUR',
    symbol: '€',
    uuid: '6d2e885e-e309-4368-bac5-b26533565a67',
    createdAt: '2025-04-06T11:44:55.808Z',
    updatedAt: '2025-04-06T11:44:55.808Z',
    deletedAt: null,
  },
  message: 'Success',
  statusCode: 201,
};

export const create400 = {
  errors: {
    name: ['name should not be empty'],
    code: [
      'code must be shorter than or equal to 3 characters',
      'code should not be empty',
    ],
    symbol: [
      'symbol must be shorter than or equal to 3 characters',
      'symbol should not be empty',
    ],
  },
  error: 'Bad Request',
  statusCode: 400,
};

export const create422 = {
  message: 'Валюта із такою назвою та/або кодом та/або символом вже існує',
  status: 'active_exists',
  error: 'Unprocessable Entity',
  statusCode: 422,
};

export const get200 = {
  data: [
    {
      uuid: '1bfa66c8-e124-482d-97a7-a965f3ff7b5e',
      createdAt: '2025-04-01T15:51:04.346Z',
      updatedAt: '2025-04-01T15:51:04.346Z',
      name: 'Гривня',
      code: 'UAH',
      symbol: '₴',
    },
    {
      uuid: '4deedf09-b86d-4799-ab10-ae1424471540',
      createdAt: '2025-04-01T15:52:53.996Z',
      updatedAt: '2025-04-01T15:52:53.996Z',
      name: 'Долар США',
      code: 'USD',
      symbol: '$',
    },
    {
      uuid: '8efa312a-f138-4c1c-b00d-43a955e7d72c',
      createdAt: '2025-04-01T16:08:24.038Z',
      updatedAt: '2025-04-06T11:19:49.962Z',
      name: 'Євро',
      code: 'EUR',
      symbol: '€',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const getByUuid200 = {
  data: {
    uuid: '8efa312a-f138-4c1c-b00d-43a955e7d72c',
    createdAt: '2025-04-01T16:08:24.038Z',
    updatedAt: '2025-04-06T11:19:49.962Z',
    name: 'Євро',
    code: 'EUR',
    symbol: '€',
  },
  message: 'Success',
  statusCode: 200,
};
export const getArchive200 = {
  data: [
    {
      uuid: '8efa312a-f138-4c1c-b00d-43a955e7d72c',
      createdAt: '2025-04-01T16:08:24.038Z',
      updatedAt: '2025-04-06T11:14:43.364Z',
      deletedAt: '2025-04-06T11:14:43.364Z',
      name: 'Євро',
      code: 'EUR',
      symbol: '€',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const update422 = {};
