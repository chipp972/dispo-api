// @flow
import { createClient } from '@google/maps';
import env from '../env';

const mapClient = createClient({
  key: env.google.apiKey,
  // clientId: env.google.clientId,
  // clientSecret: env.google.clientSecret,
  language: 'fr',
  Promise
});

export type MapUtils = {
  getGeocode: (address: string) => Promise<{ lat: number, lng: number }>
};

export const mapUtil: MapUtils = {
  getGeocode: (address: string) =>
    new Promise((resolve, reject) => {
      mapClient
        .geocode({
          address
        })
        .asPromise()
        .then(res => resolve(res.json.results[0].geometry.location))
        .catch(err => reject(err));
    })
};

