// @flow
import test from 'tape';
import { spy } from 'sinon';
import { Mockgoose } from 'mockgoose';
import mongoose, { Connection } from 'mongoose';
import { getCompanyTypeModel } from '../companytype.mongo';

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

test('CompanyType model tests', async (group) => {
  const { mongooseConnection, resetDb } = await initMockgoose();
  const model = getCompanyTypeModel(mongooseConnection);

  group.test('create', async (t) => {
    const createSpy = spy();
    model.on('created', createSpy);
    const companyType = await model.create({ name: 'test' });

    t.equal(companyType.name, 'test', 'created with the right name');
    t.ok(createSpy.called, 'created event emitted');
    t.deepEqual(
      createSpy.firstCall.args[0],
      companyType.toObject(),
      'created event emitted with created object'
    );
    resetDb();
    t.end();
  });

  group.test('update', async (t) => {
    const updateSpy = spy();
    model.on('updated', updateSpy);

    const companyType = await model.create({ name: 'test2' });
    const newCompanyType = Object.assign(companyType, { name: 'test9' });
    const updatedCompanyType = await newCompanyType.save();

    t.equal(updatedCompanyType.name, 'test9', 'updated the name');
    t.ok(updateSpy.called, 'updated event emitted');
    t.deepEqual(
      updateSpy.firstCall.args[0],
      updatedCompanyType.toObject(),
      'updated event emitted with the NEW object'
    );
    resetDb();
    t.end();
  });

  group.test('remove', async (t) => {
    const deleteSpy = spy();
    model.on('removed', deleteSpy);

    const companyType = await model.create({ name: 'test' });
    const removedCompanyType = await companyType.remove();

    t.equal(removedCompanyType.name, 'test', 'delete the right object');
    t.ok(deleteSpy.called, 'deleted event emitted');
    t.deepEqual(
      deleteSpy.firstCall.args[0],
      companyType.toObject(),
      'deleted event emitted with the object'
    );
    resetDb();
    t.end();
  });

  group.end();
});
