// @flow
// check doc at https://cloudinary.com/documentation/node_image_upload#incoming_transformations
import cloudinary from 'cloudinary';

export type CloudinaryResult = {
  public_id: string,
  version: number,
  width: number,
  height: number,
  format: string,
  bytes: number,
  ressource_type: string,
  url: string,
  secure_url: string
};

cloudinary.config({
  secure: true
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
    return await saveInCloudinary(filePath, {
      width: 90,
      height: 90,
      crop: 'thumb'
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Save a file in cloudinary
 * @param {string} filePath
 * @param {any} options
 * @return {CloudinaryResult}
 */
export const saveInCloudinary = (
  filePath: string,
  options: any
): Promise<CloudinaryResult> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      (result: CloudinaryResult, err: Error) => {
        if (err) reject(err);
        resolve(result);
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
  publicId
}: {
  publicId: string
}): Promise<any> =>
  new Promise((resolve, reject) => {
    cloudinary.v2.api.delete_resources(
      [publicId],
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });
