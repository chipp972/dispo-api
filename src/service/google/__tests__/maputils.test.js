// @flow
import test from 'tape';
import { mapUtil } from '../map.utils';

test('integration: mapUtils geocoding', async (t) => {
  try {
    const geocode = await mapUtil.getGeocode('6 rue du havre 75009 Paris');
    t.deepEqual(geocode, { lat: 48.8745772, lng: 2.3270442 });
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});
