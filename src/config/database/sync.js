// @flow
import { Queue, Job } from 'bull';
import { Redis } from 'ioredis';
import env from '../env';
import { addCompany, removeCompany } from '../../api/company/company.redis';

// TODO: implement https://github.com/OptimalBits/bull/blob/master/PATTERNS.md#reusing-redis-connections
export default function syncQueues(redis: Redis, socket: SocketIO.Socket) {
  // queue to synchronize informations with redis
  const syncCompany: Queue = new Queue('syncCompany', env.database.redisUrl, {
    prefix: 'bull'
  });

  syncCompany.process(env.queue.concurrency, (job: Job): Promise<any> => {
    const { company, type } = job.data;
    switch (type) {
      case 'add':
        return addCompany(redis, company)
          .then(() =>
            Promise.resolve(socket.in('company').broadcast.emit('newCompany', company)))
          .catch(err => Promise.reject(err));
      case 'remove':
        return removeCompany(redis, company._id)
          .then(() =>
            Promise.resolve(socket.in('company').broadcast.emit('removedCompany', company)))
          .catch(err => Promise.reject(err));
      default:
        return Promise.reject(new Error('No known type for sync operation'));
    }
  });

  return syncCompany;
}
