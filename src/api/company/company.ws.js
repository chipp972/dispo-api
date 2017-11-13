// @flow
import { SocketIO } from 'socket.io';
import { getAllCompanies, getCompanyById } from './company.redis';

const channelName = 'company';

export const event = {
  companyUpdate: 'companyUdpate'
};

export const actions = {
  getAll: 'getAll',
  getById: 'getById',
  getAroundLocation: 'getAroundLocation',
};

/**
 * Create an object to handle websocket interactions
 */
export const initCompanyChannel = (
  socket: SocketIO.Socket,
  databaseInstance: any
): ChannelConfig => ({
  channelName,
  actions: {
    getAll: async (): Promise<void> => {
      try {
        // FIXME: getAllCompanies require model : create an object DatabaseObject that contain all models and db ?
        // or maybe just require a specific object with the required models (knowing that ws will use redis mostly)
        // or change getAllCompanies to get infos from redis and use dbInstance from redis
        const companies = await getAllCompanies(databaseInstance);
        socket.in(channelName).emit(event.companyUpdate, companies);
      } catch (err) {
        throw new Error(`getAll: ${err}`);
      }
    },
    getById: async (companyId: string): Promise<void> => {
      try {
        const company = await getCompanyById(databaseInstance, companyId);
        socket.in(channelName).emit(event.companyUpdate, company);
      } catch (err) {
        throw new Error(`getById: ${err}`);
      }
    },
  }
});
