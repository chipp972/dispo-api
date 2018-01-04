// @flow
import { createClient } from '@google/maps';
import env from '../../config/env';

const mapClient = createClient({
  key: env.google.apiKey,
  // clientId: env.google.clientId,
  // clientSecret: env.google.clientSecret,
  language: 'fr',
  Promise
});

export type MapUtils = {
  getGeocode: (
    address: string
  ) => Promise<{ latitude: number, longitude: number }>
};

export const mapUtil: MapUtils = {
  getGeocode: (address: string) =>
    new Promise((resolve, reject) => {
      mapClient
        .geocode({
          address
        })
        .asPromise()
        .then((res: any) => res.json.results[0].geometry.location)
        .then((res: { lat: number, lng: number }) =>
          resolve({ latitude: res.lat, longitude: res.lng })
        )
        .catch((err: Error) => reject(err));
    })
};
