// @flow weak

type StoreItem = { _id: string, test: string };

export const mockedStore: StoreItem[] = [
  { _id: '0', test: 'test1' },
  { _id: '1', test: 'test2' },
  { _id: '2', test: 'test3' },
  { _id: '3', test: 'test4' },
  { _id: '4', test: 'test5' }
];

export const mockedModel = {
  find: ({ _id, test }) =>
    Promise.resolve(
      mockedStore
        .filter((item: StoreItem) => (test ? item.test === test : true))
        .filter((item: StoreItem) => (_id ? item._id === _id : true))
    ),
  findById: (id: string) =>
    Promise.resolve(
      mockedStore.filter((item: StoreItem) => item._id === id)[0]
    ),
  create: ({ test }: { test: string }) => Promise.resolve({ _id: '5', test }),
  remove: id => Promise.resolve({ _id: '1', test: 'hoho' })
};
