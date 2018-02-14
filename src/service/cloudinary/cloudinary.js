// @flow
// check doc at https://cloudinary.com/documentation/node_image_upload#incoming_transformations
import cloudinary from 'cloudinary';
import { deleteFile } from './cloudinary.helper';
import LOGGER from '../../config/logger';

export type CloudinaryResult = {
  public_id: string,
  version: number,
  width: number,
  height: number,
  format: string,
  bytes: number,
  ressource_type: string,
  url: string,
  secure_url: string,
};

cloudinary.config({
  secure: true,
});

/**
 * Save a logo in cloudinary
 * @param {string} filePath
 * @return {CloudinaryResult}
 */
export const saveLogoInCloudinary = async (
  filePath: string
): Promise<CloudinaryResult> => {
  try {
    LOGGER.debug(`saving ${filePath}`, 'saveLogoInCloudinary');
    const result: CloudinaryResult = await saveInCloudinary(filePath, {
      width: 90,
      height: 90,
      crop: 'thumb',
    });
    LOGGER.debug(`saved ${JSON.stringify(result)}`, 'saveLogoInCloudinary');
    return result;
  } catch (err) {
    LOGGER.error(err, 'saveLogoInCloudinary');
    throw err;
  }
};

/**
 * Save a file in cloudinary
 * @param {string} filePath
 * @param {any} options
 * @return {CloudinaryResult}
 */
const saveInCloudinary = (
  filePath: string,
  options: any
): Promise<CloudinaryResult> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      (result: CloudinaryResult, uploadError?: Error) => {
        deleteFile(filePath)
          .catch(
            (deleteError: Error) =>
              uploadError ? reject(uploadError) : reject(deleteError)
          )
          .then(() => (uploadError ? reject(uploadError) : resolve(result)));
      },
      options
    );
  });

/**
 * Delete ressources from cloudinary
 * @param {object} options
 * @param {string} options.public_id ressource id
 * @return {Promise}
 */
export const deleteFromCloudinary = ({
  publicId,
}: {
  publicId: string,
}): Promise<any> =>
  new Promise((resolve, reject) => {
    LOGGER.debug(`deleting ${publicId}`, 'deleteFromCloudinary');
    cloudinary.v2.api.delete_resources([publicId], (error, result) => {
      if (error) {
        LOGGER.error(error, 'deleteFromCloudinary');
        reject(error);
      }
      LOGGER.debug(`deleted ${result}`, 'deleteFromCloudinary');
      resolve(result);
    });
  });
