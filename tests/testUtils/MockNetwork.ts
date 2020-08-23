/* eslint-disable no-restricted-syntax */
import nock from 'nock';

const addressFixtures = [
  {
    address: 'bc1qtlrrxnqy2m9l5snrmpvaltazjf8xsndrv50gg0',
    chain_stats: {
      funded_txo_count: 1,
      funded_txo_sum: 8569,
      spent_txo_count: 1,
      spent_txo_sum: 8569,
      tx_count: 2,
    },
    mempool_stats: {
      funded_txo_count: 0,
      funded_txo_sum: 0,
      spent_txo_count: 0,
      spent_txo_sum: 0,
      tx_count: 0,
    },
  },
  {
    address: 'bc1qfqkynacp6m3vyau37unqedsqa8pzjgtw3nr4sq',
    chain_stats: {
      funded_txo_count: 1,
      funded_txo_sum: 8534,
      spent_txo_count: 0,
      spent_txo_sum: 0,
      tx_count: 1,
    },
    mempool_stats: {
      funded_txo_count: 0,
      funded_txo_sum: 0,
      spent_txo_count: 0,
      spent_txo_sum: 0,
      tx_count: 0,
    },
  },
  {
    address: 'bc1qahwyxrecm4dna5yu0kw43mnz6nq64a6vwt7a4p',
    chain_stats: {
      funded_txo_count: 1,
      funded_txo_sum: 17221,
      spent_txo_count: 1,
      spent_txo_sum: 17221,
      tx_count: 2,
    },
    mempool_stats: {
      funded_txo_count: 0,
      funded_txo_sum: 0,
      spent_txo_count: 0,
      spent_txo_sum: 0,
      tx_count: 0,
    },
  },
  {
    address: 'bc1qa3kj8eszctlghlyljlwsjwcqgwr5m0js7dnxal',
    chain_stats: {
      funded_txo_count: 0,
      funded_txo_sum: 0,
      spent_txo_count: 0,
      spent_txo_sum: 0,
      tx_count: 0,
    },
    mempool_stats: {
      funded_txo_count: 0,
      funded_txo_sum: 0,
      spent_txo_count: 0,
      spent_txo_sum: 0,
      tx_count: 0,
    },
  },
  {
    address: 'bc1qy852x6utuf05mfwq9369552gqpzdz05syn26xj',
    chain_stats: {
      funded_txo_count: 2,
      funded_txo_sum: 95973,
      spent_txo_count: 1,
      spent_txo_sum: 43624,
      tx_count: 3,
    },
    mempool_stats: {
      funded_txo_count: 0,
      funded_txo_sum: 0,
      spent_txo_count: 0,
      spent_txo_sum: 0,
      tx_count: 0,
    },
  },
];

const utxoFixtures = [
  [
    'bc1qy852x6utuf05mfwq9369552gqpzdz05syn26xj',
    [
      {
        txid:
          '36a613aedfbb0475cebf81870495765ad23cf345563a8ae5e9223b7dbd30bcc1',
        vout: 1,
        status: {
          confirmed: true,
          block_height: 644797,
          block_hash:
            '0000000000000000000d275921aea0dd77d25a623eaf8563b4cda162ab089292',
          block_time: 1598070755,
        },
        value: 52349,
      },
    ],
  ],
  [
    'bc1qfqkynacp6m3vyau37unqedsqa8pzjgtw3nr4sq',
    [
      [
        {
          txid:
            'fdffd8869b31827ef7664444242be6e63a92b542d7626b8109a6f2a7e1624f9a',
          vout: 1,
          status: {
            confirmed: true,
            block_height: 644934,
            block_hash:
              '00000000000000000000ad5a2d9b5fb41ebcd9730bc92d791b39ac59d820338b',
            block_time: 1598156820,
          },
          value: 8534,
        },
      ],
    ],
  ],
];

const unusedAddressFixture = {
  chain_stats: {
    funded_txo_count: 0,
    funded_txo_sum: 0,
    spent_txo_count: 0,
    spent_txo_sum: 0,
    tx_count: 0,
  },
  mempool_stats: {
    funded_txo_count: 0,
    funded_txo_sum: 0,
    spent_txo_count: 0,
    spent_txo_sum: 0,
    tx_count: 0,
  },
};

export class MockNetwork {
  static start = () => {
    nock.cleanAll();

    const scope = nock('https://blockstream.info/api');

    for (const utxoFixture of utxoFixtures) {
      scope.get(`/address/${utxoFixture[0]}/utxo`).reply(200, utxoFixture[1]);
    }

    for (const addressFixture of addressFixtures) {
      scope
        .get(`/address/${addressFixture.address}`)
        .reply(200, addressFixture);
    }

    scope.get(/address\/bc1.\w+$/).reply(200, (url) => {
      const address = url.split('/')[3];

      return {
        address,
        ...unusedAddressFixture,
      };
    });

    scope.persist();
  };
}
