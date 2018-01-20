// @flow
import {
  saveLogoInCloudinary,
  deleteFromCloudinary
} from '../../service/cloudinary/cloudinary';
import LOGGER from '../../config/logger';
import { deleteFile } from '../../helper';
import { Model } from 'mongoose';
import type { CrudOptions } from '../../service/crud/crud.type';
import type { Company } from './company';

export const updateCompanyAvailability = async ({
  CompanyModel,
  id,
  available,
  apiEvents
}: {
  CompanyModel: Model,
  id: string,
  available: boolean
}): Promise<Company> => {
  try {
    const company = await CompanyModel.findById(id);
    const newCompany = Object.assign(company, { available });
    await newCompany.save();
    return newCompany.toObject();
  } catch (err) {
    throw err;
  }
};

/**
 * Verify if the logo of the company is already uploaded
 * and delete it then upload the image given
 * @return {{ success: boolean }}
 */
export const uploadCompanyLogo = async ({
  id,
  data,
  user,
  files
}: CrudOptions) => {
  try {
    LOGGER.debug(files, 'files in company operations');
    const img = files && files.companyImage;
    if (!img) return { success: true };
    if (data.imageCloudId && /cloudinary/.test(data.imageUrl)) {
      await deleteFromCloudinary({
        publicId: data.imageCloudId
      });
    }
    const uploadRes = await saveLogoInCloudinary(img.path);
    LOGGER.debug(uploadRes, 'upload image in cloudinary');
    data.imageCloudId = uploadRes.public_id;
    data.imageUrl = uploadRes.secure_url;
    await deleteFile(img.path);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
