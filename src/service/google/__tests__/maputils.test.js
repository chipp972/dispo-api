// @flow
import test from 'tape';
import { mapUtil } from '../map.utils';

test.skip('integration: mapUtils geocoding', async (t) => {
  try {
    const geocode = await mapUtil.getGeocode('6 rue du havre 75009 Paris');
    t.deepEqual(geocode, { latitude: 48.8745772, longitude: 2.3270442 });
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});
