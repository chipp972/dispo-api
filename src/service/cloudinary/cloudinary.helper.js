// @flow
import { unlink } from 'fs';

export const deleteFile = (path: string): Promise<void> =>
  new Promise((resolve, reject) => {
    unlink(path, (err: *) => (err ? reject(err) : resolve()));
  });
