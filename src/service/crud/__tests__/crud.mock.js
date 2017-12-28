// @flow weak
export const mockedStore = [
  { _id: '0', test: 'test1' },
  { _id: '1', test: 'test2' },
  { _id: '2', test: 'test3' },
  { _id: '3', test: 'test4' },
  { _id: '4', test: 'test5' }
];

export const mockedModel = {
  find: () => Promise.resolve(mockedStore),
  findById: (id: string) =>
    Promise.resolve(mockedStore.filter(item => item._id === id)[0]),
  create: ({ test }: { test: string }) =>
    Promise.resolve({ _id: '5', test }),
  update: ({ $set: { test }}) => Promise.resolve({ _id: '1', test: 'hoho' }),
  remove: (id) => Promise.resolve({ _id: '1', test: 'hoho' })
};
