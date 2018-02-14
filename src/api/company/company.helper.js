// @flow
type Options = {
  data: { imageCloudId?: string, imageUrl?: string },
  files?: { companyImage: any },
  LOGGER: any,
  deleteImage: ({ publicId: string }) => Promise<any>,
  saveImage: (
    path: string
  ) => Promise<{ public_id: string, secure_url: string }>,
};

/**
 * Verify if the logo of the company is already uploaded
 * and delete it then upload the image given
 *
 * @param {Options} options
 * @return {{ success: boolean, error: Error }}
 */
export const uploadCompanyLogo = async ({
  data,
  files,
  LOGGER,
  deleteImage,
  saveImage,
}: Options) => {
  try {
    LOGGER.debug(files, 'files in company operations');
    const img = files && files.companyImage;
    if (!img) return { success: true };
    if (
      data.imageCloudId &&
      data.imageUrl &&
      /cloudinary/.test(data.imageUrl)
    ) {
      await deleteImage({
        publicId: data.imageCloudId,
      });
    }
    const uploadRes = await saveImage(img.path);
    LOGGER.debug(uploadRes, 'upload image in cloudinary');
    data.imageCloudId = uploadRes.public_id;
    data.imageUrl = uploadRes.secure_url;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
