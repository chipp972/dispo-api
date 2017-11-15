// @flow
import { createClient } from '@google/maps';
import env from '../env';

console.log(env.google);

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

mapUtil
  .getGeocode('6 rue du havre 75009 Paris')
  .then(res => console.log(res))
  .catch(err => console.log(err));
