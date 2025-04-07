export const create201 = {
  data: {
    name: 'Квартира',
    description: 'Житлове приміщення в багатоквартирному будинку',
    category_uuid: '16c54408-c064-4ad0-8e70-0c138f768b3c',
    slug: 'kvartira',
    uuid: '16ea985e-1099-4f65-9bf7-b9bd89c15fe3',
    createdAt: '2025-04-06T16:13:23.622Z',
    updatedAt: '2025-04-06T16:13:23.622Z',
    deletedAt: null,
  },
  message: 'Created',
  statusCode: 201,
};

export const create400 = {
  errors: {
    name: ['name should not be empty'],
    category_uuid: ['category_uuid should not be empty'],
  },
  error: 'Bad Request',
  statusCode: 400,
};

export const create422 = {
  message: 'Невідоме значення категорії',
  error: 'Unprocessable Entity',
  statusCode: 422,
};

export const get200 = {
  data: [
    {
      uuid: '16ea985e-1099-4f65-9bf7-b9bd89c15fe3',
      createdAt: '2025-04-06T16:13:23.622Z',
      updatedAt: '2025-04-06T16:13:23.622Z',
      name: 'Квартира',
      slug: 'kvartira',
      description: 'Житлове приміщення в багатоквартирному будинку',
      category_uuid: '16c54408-c064-4ad0-8e70-0c138f768b3c',
    },
    {
      uuid: '398ae2c9-34e8-4d17-9229-ed2c270ef438',
      createdAt: '2025-04-06T16:31:45.994Z',
      updatedAt: '2025-04-06T16:31:45.994Z',
      name: 'Офісне приміщення',
      slug: 'ofisne-primishennya',
      description:
        'Приміщення, призначене для ведення бізнесу або роботи в офісному середовищі',
      category_uuid: '4d203e69-27b1-4ee0-b0d0-42afab465dbf',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const getByUuid200 = {
  data: {
    uuid: '16ea985e-1099-4f65-9bf7-b9bd89c15fe3',
    createdAt: '2025-04-06T16:13:23.622Z',
    updatedAt: '2025-04-06T16:13:23.622Z',
    name: 'Квартира',
    slug: 'kvartira',
    description: 'Житлове приміщення в багатоквартирному будинку',
    category_uuid: '16c54408-c064-4ad0-8e70-0c138f768b3c',
  },
  message: 'Success',
  statusCode: 200,
};

export const getArchive200 = {
  data: [
    {
      uuid: 'f959b32f-07b7-45f0-9392-94a7bb6a7b28',
      createdAt: '2025-04-07T13:50:24.940Z',
      updatedAt: '2025-04-07T14:20:43.945Z',
      deletedAt: '2025-04-07T14:20:43.945Z',
      name: 'Земля під житлову забудову',
      slug: 'zemlya-pid-zhitlovu-zabudovu',
      description: 'Територія, що призначена для забудови',
      category_uuid: '7931fc20-1c68-432b-8a13-26162a2bfd73',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const update422 = {
  message: 'Тип з такою назвою вже існує',
  error: 'Unprocessable Entity',
  statusCode: 422,
};
