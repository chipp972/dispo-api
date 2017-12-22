// @flow
import { SocketIO } from 'socket.io';
import { getUserById, getAllUsers, modifyUser, removeUser } from './user.redis';

const channelName = 'user';

const event = {
  update: 'userUdpate'
};

/**
 * Create an object to handle websocket interactions
 */
const initUserChannel = (
  socket: SocketIO.Socket,
  databaseInstance: any
): ChannelConfig => ({
  channelName,
  actions: {
    getAll: async (): Promise<void> => {
      try {
        const users = await getAllUsers(databaseInstance);
        socket.in(channelName).emit(event.update, users);
      } catch (err) {
        throw new Error(`getAll: ${err}`);
      }
    },
    getById: async (userId: string): Promise<void> => {
      try {
        const user = await getUserById(databaseInstance, userId);
        socket.in(channelName).emit(event.update, user);
      } catch (err) {
        throw new Error(`getById: ${err}`);
      }
    },
    setById: async (user: User): Promise<void> => {
      try {
        const newUser = await modifyUser(databaseInstance, user);
        socket.in(channelName).emit(event.update, newUser);
      } catch (err) {
        throw new Error(`setById: ${err}`);
      }
    },
    removeById: async (userId: string): Promise<void> => {
      try {
        const newUser = await removeUser(databaseInstance, userId);
        socket.in(channelName).emit(event.update, newUser);
      } catch (err) {
        throw new Error(`removeById: ${err}`);
      }
    }
  }
});

export default initUserChannel;
