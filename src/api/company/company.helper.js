// @flow
import EventEmitter from 'events';
import {
  saveLogoInCloudinary,
  deleteFromCloudinary
} from '../../service/cloudinary/cloudinary';
import { EVENTS } from '../../service/websocket/websocket.event';
import { Model } from 'mongoose';
import type { CrudOptions } from '../../service/crud/crud';

export const updateCompanyAvailability = async ({
  CompanyModel,
  id,
  available,
  apiEvents
}: {
  CompanyModel: Model,
  id: string,
  available: boolean,
  apiEvents: EventEmitter
}) => {
  try {
    const company = await CompanyModel.findById(id);
    const newCompany = Object.assign(company, { available });
    await newCompany.save();
    const event = available
      ? EVENTS.COMPANY.setAvailable
      : EVENTS.COMPANY.setUnavailable;
    apiEvents.emit(event, newCompany.toObject());
  } catch (err) {
    throw err;
  }
};

/**
 * Verify if the logo of the company is already uploaded
 * and delete it then upload the image given
 */
export const uploadCompanyLogo = async ({
  id,
  data,
  user,
  files
}: CrudOptions) => {
  delete data.geoAddress; // can't trust client
  const img = files && files.companyImage;
  if (!img) return;
  if (data.imageCloudId && /cloudinary/.test(data.imageUrl)) {
    await deleteFromCloudinary({
      publicId: data.imageCloudId
    });
  }
  const uploadRes = await saveLogoInCloudinary(img.path);
  data.imageCloudId = uploadRes.public_id;
  data.imageUrl = uploadRes.secure_url;
};
