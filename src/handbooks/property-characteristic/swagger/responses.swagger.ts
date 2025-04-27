export const create201 = {
  data: {
    name: 'Балкон/лоджія',
    type: 4,
    is_multiple: false,
    description: 'Наявність балкону або лоджії',
    uuid: '2b6574c4-e133-40be-9c8a-6a294f7494a3',
    createdAt: '2025-04-12T19:08:38.392Z',
    updatedAt: '2025-04-12T19:08:38.392Z',
    deletedAt: null,
  },
  message: 'Created',
  statusCode: 201,
};

export const create400 = {
  errors: {
    name: [
      'name must be longer than or equal to 3 characters',
      'name should not be empty',
    ],
  },
  error: 'Bad Request',
  statusCode: 400,
};

export const create422 = {
  message: 'Характеристика з такою назвою та таким типом вже існує',
  error: 'Unprocessable Entity',
  statusCode: 422,
};

export const get200 = {
  data: [
    {
      uuid: 'cc2fc8ec-ffd0-4a28-891d-145b16e82c48',
      createdAt: '2025-04-12T18:59:42.886Z',
      updatedAt: '2025-04-12T18:59:42.886Z',
      name: 'Кількість кімнат',
      type: 1,
      is_multiple: false,
      description: 'Кількість кімнат у помешканні',
    },
    {
      uuid: '2b6574c4-e133-40be-9c8a-6a294f7494a3',
      createdAt: '2025-04-12T19:08:38.392Z',
      updatedAt: '2025-04-12T19:08:38.392Z',
      name: 'Балкон/лоджія',
      type: 4,
      is_multiple: false,
      description: 'Наявність балкону або лоджиї',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const getByUuid200 = {
  data: {
    uuid: '2b6574c4-e133-40be-9c8a-6a294f7494a3',
    createdAt: '2025-04-12T19:08:38.392Z',
    updatedAt: '2025-04-26T13:21:51.134Z',
    name: 'Балкон/лоджія',
    type: 4,
    is_multiple: false,
    description: 'Наявність балкону або лоджії',
  },
  message: 'Success',
  statusCode: 200,
};

export const getArchive200 = {
  data: [
    {
      uuid: '2b6574c4-e133-40be-9c8a-6a294f7494a3',
      createdAt: '2025-04-12T19:08:38.392Z',
      updatedAt: '2025-04-26T12:56:29.718Z',
      deletedAt: '2025-04-26T12:56:29.718Z',
      name: 'Балкон/лоджія',
      type: 4,
      description: 'Наявність балкону або лоджії',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const update422 = {
  message: "'is_multiple=true' доступно лише для типу 3",
  error: 'Unprocessable Entity',
  statusCode: 422,
};
