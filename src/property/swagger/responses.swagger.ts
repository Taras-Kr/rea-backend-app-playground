export const create201 = {
  data: {
    title: 'Затишна двокімнатна квартира на Липинського, 10 з видом на парк',
    is_published: false,
    propertyType: {
      uuid: '16ea985e-1099-4f65-9bf7-b9bd89c15fe3',
      createdAt: '2025-04-06T16:13:23.622Z',
      updatedAt: '2025-06-02T16:35:57.705Z',
      name: 'Квартира',
      slug: 'kvartira',
      description: 'Житлове приміщення в багатоквартирному будинку',
      category_uuid: '16c54408-c064-4ad0-8e70-0c138f768b3c',
    },
    location: {
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
    gallery_uuid: null,
    uuid: '7b6cdbe5-b4f4-446a-a444-ff086321e33b',
    createdAt: '2025-06-09T15:30:11.457Z',
    updatedAt: '2025-06-09T15:30:11.457Z',
    deletedAt: null,
  },
  message: 'Created',
  statusCode: 201,
};

export const create400 = {
  errors: {
    property_type_uuid: ['Некоректний формат UUID для типу нерухомості.'],
    location_uuid: ["Некоректний формат UUID для адреси об'єкта нерухомості."],
    gallery_uuid: ['Некоректний формат UUID для галереї.'],
  },
  error: 'Bad Request',
  statusCode: 400,
};

export const create422 = {};
export const create404 = {
  message: 'Вибраний тип нерухомості не знайдено.',
  error: 'Not Found',
  statusCode: 404,
};

export const get200 = {
  data: [
    {
      uuid: '7b6cdbe5-b4f4-446a-a444-ff086321e33b',
      title: 'Затишна двокімнатна квартира на Липинського, 10 з видом на парк',
      is_published: false,
      gallery_uuid: null,
      propertyType: {
        uuid: '16ea985e-1099-4f65-9bf7-b9bd89c15fe3',
        name: 'Квартира',
        category: {
          uuid: '16c54408-c064-4ad0-8e70-0c138f768b3c',
          name: 'Житлова нерухомість',
        },
      },
      location: {
        uuid: '4117f984-4dfb-4cb5-969f-5c1679c955fb',
        community: 'Львівська ОТГ',
        settlement: 'Львів',
        district: 'Франківський',
        street: 'Бойчука',
        building_number: '100-Б',
        apartment_number: '259-П',
      },
    },
  ],
  message: 'Success',
  statusCode: 200,
};

export const getByUuid200 = {
  data: {
    uuid: '7b6cdbe5-b4f4-446a-a444-ff086321e33b',
    createdAt: '2025-06-09T15:30:11.457Z',
    title: 'Затишна двокімнатна квартира на Липинського, 10 з видом на парк',
    is_published: false,
    gallery_uuid: null,
    property_type: {
      uuid: '16ea985e-1099-4f65-9bf7-b9bd89c15fe3',
      name: 'Квартира',
      category: {
        uuid: '16c54408-c064-4ad0-8e70-0c138f768b3c',
        name: 'Житлова нерухомість',
      },
    },
    location: {
      uuid: '4117f984-4dfb-4cb5-969f-5c1679c955fb',
      community: 'Львівська ОТГ',
      settlement: 'Львів',
      district: 'Франківський',
      street: 'Бойчука',
      building_number: '100-Б',
      apartment_number: '259-П',
    },
  },
  message: 'Success',
  statusCode: 200,
};

export const getArchive200 = {};

export const update422 = {};
