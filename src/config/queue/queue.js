// @flow
import { SocketIO } from 'socket.io';
import { Queue, Job } from 'bull';
import { Redis } from 'ioredis';
import env from '../env';
import { addToHash, removeFromHash } from '../../api/utils.redis';

// TODO: implement https://github.com/OptimalBits/bull/blob/master/PATTERNS.md#reusing-redis-connections
export default function syncQueues(redis: Redis, socket: SocketIO.Socket) {
  // queue to synchronize informations with redis
  const syncRedis: Queue = new Queue('syncRedis', env.database.redisUrl, {
    prefix: 'bull'
  });

  syncRedis.process(env.queue.concurrency, (job: Job): Promise<any> => {
    const {
      hashKey,
      dataKey,
      data,
      operationType,
      channelName,
      channelMessage
    } = job.data;
    switch (operationType) {
      case 'add':
        return addToHash(redis, hashKey, dataKey, data)
          .then(() =>
            Promise.resolve(socket.in(channelName).broadcast.emit(channelMessage, data)))
          .catch(err => Promise.reject(err));
      case 'remove':
        return removeFromHash(redis, hashKey, dataKey)
          .then(() =>
            Promise.resolve(socket.in(channelName).broadcast.emit(channelMessage, data)))
          .catch(err => Promise.reject(err));
      default:
        return Promise.reject(new Error('No known type for sync operation'));
    }
  });

  return syncRedis;
}
