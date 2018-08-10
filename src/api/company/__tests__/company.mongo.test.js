// @flow
import test from 'tape';
import { spy, stub } from 'sinon';
import { Mockgoose } from 'mockgoose';
import mongoose, { Connection } from 'mongoose';
import { getCompanyModel } from '../company.mongo';

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
  const fakeModel = { findById: (_id) => ({ _id }) };
  const getGeocode = stub().returns({ latitude: 10, longitude: 10 });
  const deleteImage = stub().returns({});
  const model = getCompanyModel({
    mongooseConnection,
    UserModel: fakeModel,
    CompanyTypeModel: fakeModel,
    allowEarlyRefresh: false,
    getGeocode,
    deleteImage,
  });

  group.test('create', async (t) => {
    try {
      const createSpy = spy();
      model.on('created', createSpy);
      const company = await model.create({
        name: 'test',
        address: 'addressTest',
      });

      t.equal(company.name, 'test', 'created with the right name');
      t.equal(company.address, 'addressTest', 'created with the right address');
      t.deepEqual(
        company.geoAddress,
        { latitude: 10, longitude: 10 },
        'added geoAddress field'
      );
      t.ok(createSpy.called, 'created event emitted');
      t.deepEqual(
        createSpy.firstCall.args[0],
        company.toObject(),
        'created event emitted with created object'
      );
    } catch (err) {
      t.fail(err.message);
    }
    resetDb();
    t.end();
  });

  // TODO: test field validation
  // TODO: test update (return value + db state + event emission)
  // TODO: test early refresh
  // TODO: test getGeocode returning an error make create/update fail
  // TODO: test create with invalid owner
  // TODO: test update with invalid owner
  // TODO: test create with invalid type
  // TODO: test update with invalid type
  // TODO: test delete (return value + db state + event emission)

  group.end();
});
