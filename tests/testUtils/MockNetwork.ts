/* eslint-disable no-restricted-syntax */
import { matches } from 'lodash';
import * as nock from 'nock';

export class MockNetwork {
  static start = () => {
    nock.cleanAll();

    nock('https://blockstream.info/api')
      .get('/address/someaddr')
      .reply(200, {})

      .persist();
  };
}
