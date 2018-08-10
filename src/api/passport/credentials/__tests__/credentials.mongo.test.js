// @flow
import test from 'tape';
import { Mockgoose } from 'mockgoose';
import mongoose, { Connection } from 'mongoose';
import { getCredentialsModel } from '../credentials.mongo';

async function initMockgoose(): Connection {
  const mockgoose: Mockgoose = new Mockgoose(mongoose);
  await mockgoose.prepareStorage();
  const mongooseConnection: Connection = await mongoose.createConnection(
    '',
    {}
  );
  return { mongooseConnection, resetDb: () => mockgoose.helper.reset() };
}

test.onFinish(() => {
  mongoose.disconnect();
  process.exit();
});

test('Company model tests', async (group) => {
  const { mongooseConnection, resetDb } = await initMockgoose();
  const model = getCredentialsModel({
    mongooseConnection,
    saltRounds: 1,
  });

  group.test('create', async (t) => {
    try {
      const credentials = await model.create({
        email: 'test@gmail.com',
        password: 'test',
        role: 'user',
      });

      t.equal(
        credentials.email,
        'test@gmail.com',
        'created with the right email'
      );
      t.ok(credentials.password, 'contains password');
      t.notEqual(credentials.password, 'test', 'hashed password');
      t.equal(credentials.role, 'user', 'created with the right role');
      t.ok(credentials._id);
    } catch (err) {
      t.fail(err.message);
    }
    resetDb();
    t.end();
  });

  group.test('create with oldPassword', async (t) => {
    try {
      const credentials = await model.create({
        email: 'test@gmail.com',
        password: 'test',
        oldPassword: 'test',
        role: 'user',
      });

      t.notOk(credentials.oldPassword, 'does not contain old password');
    } catch (err) {
      t.fail(err.message);
    }
    resetDb();
    t.end();
  });

  group.test('update WITHOUT oldPassword', async (t) => {
    try {
      const credentials = await model.create({
        email: 'test@gmail.com',
        password: 'test',
        role: 'user',
      });

      credentials.password = 'test2';
      await credentials.save();
      t.fail('no old password did not throw an error');
    } catch (err) {
      t.equal(
        err.code,
        'INVALID_OLD_PASSWORD',
        'invalid password error is thrown'
      );
    }
    resetDb();
    t.end();
  });

  group.test('update WITH oldPassword', async (t) => {
    try {
      const credentials = await model.create({
        email: 'test@gmail.com',
        password: 'test',
        role: 'user',
      });

      const oldHash = credentials.password;
      credentials.password = 'test2';
      credentials.oldPassword = 'test';
      const newCredentials = await credentials.save();
      t.ok(credentials.password, 'password is not empty');
      t.notEqual('test2', credentials.password, 'password is hashed');
      t.notOk(newCredentials.oldPassword, 'old password deleted from model');
      t.notEqual(oldHash, newCredentials.password, 'password updated');
    } catch (err) {
      t.fail(err.message);
    }
    resetDb();
    t.end();
  });

  group.end();
});
