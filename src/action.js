import dbKeys from './database/dbkeys';

const GET_ADMIN_CONFIG = 'GET_ADMIN_CONFIG';
const SET_ADMIN_CONFIG = 'SET_ADMIN_CONFIG';
const ADMIN_CONFIG_UPDATE = 'ADMIN_CONFIG_UPDATE';

export const adminListeners = async (socket, db) => {
  socket.on(GET_ADMIN_CONFIG, async () => {
    const adminConfig = await db.get(dbKeys.ADMIN_CONFIG);
    console.log(adminConfig);
    // TODO: emit if no error
    socket.emit(ADMIN_CONFIG_UPDATE, adminConfig);
  });

  socket.on(SET_ADMIN_CONFIG, async newConfig => {
    const dbResponse = await db.set(dbKeys.ADMIN_CONFIG, newConfig);
    console.log(dbResponse);
    // TODO: broadcast if no error
    socket.broadcast.emit(ADMIN_CONFIG_UPDATE, newConfig);
    socket.emit(ADMIN_CONFIG_UPDATE, newConfig);
  });
};
