// @flow
import test from 'tape';
import RedisMock from 'ioredis-mock';
import {
  addUser,
  modifyUser,
  removeUser,
  getAllUsers,
  getUserById,
  keys,
  getUserByEmail
} from '../user.redis';

const createRedisMock = data => new RedisMock({ data });
const data = {
  [keys.emailIndex]: {
    'hihi@njnj.com': 'user:1',
    'hiho@njoj.com': 'user:2'
  },
  [keys.id]: '2',
  [keys.user]: {
    'user:1': `{ "id": "user:1", "email":"hihi@njnj.com", "password":"oij*!#^o12i", "address":"12 rue du oidj 92377" }`,
    'user:2': `{ "id": "user:2", "email":"hiho@njoj.com", "password":"oijo!#^97ji", "address":"12 rue du oidj 92377" }`
  }
};

test('should add an user', async (t) => {
  const mock = createRedisMock({});
  const userData: UserData = {
    email: 'hihi@njnj.com',
    password: 'oij*!#^o12i',
    address: '12 rue du oidj 92377'
  };
  try {
    const res = await addUser(mock, userData);
    const newId = await mock.get(keys.id);
    const userList = await mock.hgetall(keys.user);
    const mailIndex = await mock.hgetall(keys.emailIndex);
    t.equal(res, []);
    t.equal(newId, '1');
    t.deepEqual(mailIndex, {
      'hihi@njnj.com': 'user:1'
    });
    t.deepEqual(userList, {
      'user:1': JSON.stringify({ id: 'user:1', ...userData })
    });
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});

test('should modify an user', async (t) => {
  const mock = createRedisMock(data);
  const modifiedUser: User = {
    id: 'user:1',
    email: 'hihi@n4n4.com',
    password: 'oij*!#^o1weiwej2i',
    address: '123 rue du oidj 92377'
  };
  try {
    const res = await modifyUser(mock, modifiedUser);
    const lastUserId = await mock.get(keys.id);
    const newUser: User = await mock.hmget(keys.user, modifiedUser.id);
    t.equal(res, []);
    t.equal(lastUserId, '2');
    t.deepEqual([JSON.stringify(modifiedUser)], newUser);
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});

test('should remove an user', async (t) => {
  const mock = createRedisMock(data);
  try {
    const res = await removeUser(mock, 'user:1');
    const res2 = await removeUser(mock, 'user:2');
    const lastUserId = await mock.get(keys.id);
    const users = await mock.hgetall(keys.user);
    t.equal(res, 1);
    t.equal(res2, 1);
    t.equal(lastUserId, '2');
    t.deepEqual(users, {});
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});

test('should get all users', async (t) => {
  const mock = createRedisMock(data);
  try {
    const res = await getAllUsers(mock);
    const lastUserId = await mock.get(keys.id);
    t.equal(lastUserId, '2');
    t.deepEqual(res, [
      {
        id: 'user:1',
        email: 'hihi@njnj.com',
        password: 'oij*!#^o12i',
        address: '12 rue du oidj 92377'
      },
      {
        id: 'user:2',
        email: 'hiho@njoj.com',
        password: 'oijo!#^97ji',
        address: '12 rue du oidj 92377'
      }
    ]);
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});

test('should get an user by id', async (t) => {
  const mock = createRedisMock(data);
  try {
    const res = await getUserById(mock, 'user:1');
    t.deepEqual(res, {
      id: 'user:1',
      email: 'hihi@njnj.com',
      password: 'oij*!#^o12i',
      address: '12 rue du oidj 92377'
    });
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});

test('should get an user by email', async (t) => {
  const mock = createRedisMock(data);
  try {
    const res = await getUserByEmail(mock, 'hiho@njoj.com');
    t.deepEqual(res, {
      id: 'user:2',
      email: 'hiho@njoj.com',
      password: 'oijo!#^97ji',
      address: '12 rue du oidj 92377'
    });
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});
