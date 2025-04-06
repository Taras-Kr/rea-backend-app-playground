export const create201 = {
  data: {
    name: 'Земельні ділянки1',
    slug: 'zemelni-dilyanki1',
    uuid: 'c105792e-99d7-4462-ac2b-657b51740728',
    createdAt: '2025-04-05T15:36:19.260Z',
    updatedAt: '2025-04-05T15:36:19.260Z',
    deletedAt: null,
  },
  message: 'Success',
  statusCode: 201,
};

export const create400 = {
  errors: {
    name: ['name should not be empty'],
  },
  error: 'Bad Request',
  statusCode: 400,
};

export const create422 = {
  message: 'Така категорія вже існує',
  status: 'active_exists',
  error: 'Unprocessable Entity',
  statusCode: 422,
};

export const get200 = {
  data: [
    {
      uuid: '16c54408-c064-4ad0-8e70-0c138f768b3c',
      createdAt: '2025-04-04T13:14:24.527Z',
      updatedAt: '2025-04-04T13:14:24.527Z',
      name: 'Житлова нерухомість',
      slug: 'zhitlova-neruhomist',
    },
    {
      uuid: '4d203e69-27b1-4ee0-b0d0-42afab465dbf',
      createdAt: '2025-04-04T13:18:33.491Z',
      updatedAt: '2025-04-04T13:18:33.491Z',
      name: 'Комерційна нерухомість',
      slug: 'komercijna-neruhomist',
    },
    {
      uuid: '7931fc20-1c68-432b-8a13-26162a2bfd73',
      createdAt: '2025-04-04T13:34:33.134Z',
      updatedAt: '2025-04-05T09:13:12.744Z',
      name: 'Земельні ділянки',
      slug: 'zemelni-dilyanki',
    },
    {
      uuid: '2d7ce4f9-d673-485f-9d2b-441ae9c5fbe3',
      createdAt: '2025-04-04T13:34:54.501Z',
      updatedAt: '2025-04-05T10:39:31.704Z',
      name: 'Спеціалізована нерухомість',
      slug: 'specializovana-neruhomist',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const getByUuid200 = {
  data: {
    uuid: '4d203e69-27b1-4ee0-b0d0-42afab465dbf',
    createdAt: '2025-04-04T13:18:33.491Z',
    updatedAt: '2025-04-04T13:18:33.491Z',
    name: 'Комерційна нерухомість',
    slug: 'komercijna-neruhomist',
  },
  message: 'Success',
  statusCode: 200,
};

export const getArchive200 = {
  data: [
    {
      uuid: '7931fc20-1c68-432b-8a13-26162a2bfd73',
      createdAt: '2025-04-04T13:34:33.134Z',
      updatedAt: '2025-04-05T16:58:06.981Z',
      deletedAt: '2025-04-05T16:58:06.981Z',
      name: 'Земельні ділянки',
      slug: 'zemelni-dilyanki',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const update422 = {
  message: 'Категорія з такою назвою вже існує',
  error: 'Unprocessable Entity',
  statusCode: 422,
};
