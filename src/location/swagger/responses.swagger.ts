export const create201 = {
  data: {
    community: 'Львівська ОТГ',
    settlement: 'Львів',
    district: 'Франківський',
    street: 'Бойчука',
    building_number: '100-Б',
    apartment_number: '259-П',
    description: 'Вхід через провулок. Поряд школа',
    latitude: 49.8233219,
    longitude: 24.0636658,
    uuid: '4117f984-4dfb-4cb5-969f-5c1679c955fb',
    createdAt: '2025-04-08T16:03:59.630Z',
    updatedAt: '2025-04-08T16:03:59.630Z',
    deletedAt: null,
  },
  message: 'Success',
  statusCode: 201,
};

export const create400 = {
  errors: {
    settlement: [
      'settlement must be longer than or equal to 1 characters',
      'settlement should not be empty',
    ],
  },
  error: 'Bad Request',
  statusCode: 400,
};

export const create422 = {};

export const get200 = {
  data: [
    {
      uuid: '4117f984-4dfb-4cb5-969f-5c1679c955fb',
      createdAt: '2025-04-08T16:03:59.630Z',
      updatedAt: '2025-04-08T16:03:59.630Z',
      community: 'Львівська ОТГ',
      settlement: 'Львів',
      district: 'Франківський',
      street: 'Бойчука',
      building_number: '100-Б',
      apartment_number: '259-П',
      description: 'Вхід через провулок. Поряд школа',
      latitude: '49.823322',
      longitude: '24.063666',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const getByUuid200 = {
  data: {
    uuid: '4117f984-4dfb-4cb5-969f-5c1679c955fb',
    createdAt: '2025-04-08T16:03:59.630Z',
    updatedAt: '2025-04-08T16:03:59.630Z',
    community: 'Львівська ОТГ',
    settlement: 'Львів',
    district: 'Франківський',
    street: 'Бойчука',
    building_number: '100-Б',
    apartment_number: '259-П',
    description: 'Вхід через провулок. Поряд школа',
    latitude: '49.823322',
    longitude: '24.063666',
  },
  message: 'Success',
  statusCode: 200,
};

export const getArchive200 = {
  data: [
    {
      uuid: '818c5f6e-673b-4bc0-8690-6d2ba8de86e9',
      createdAt: '2025-04-09T13:02:27.336Z',
      updatedAt: '2025-04-09T13:26:20.606Z',
      deletedAt: '2025-04-09T13:26:20.606Z',
      community: 'Львівська ОТГ',
      settlement: 'м. Львів',
      district: 'Сихівський',
      street: 'пр. Червоної Калини',
      building_number: '1',
      apartment_number: '152',
      description: '',
      latitude: '0.000000',
      longitude: '0.000000',
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const update422 = {};
