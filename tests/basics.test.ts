import { Wallet } from 'src/Wallet';
import { esplora } from 'src/Esplora';
import { MockNetwork } from 'tests/testUtils/MockNetwork';

const testMnemonic =
  'base index concert culture silver say return vote dial pepper cloud kingdom fly outer tornado';

describe('Wallet basics', () => {
  beforeAll(() => {
    MockNetwork.start();
  });
  it('requires a blockchain service for initialization', async () => {
    expect(() => new Wallet(esplora)).not.toThrow();
  });

  it('can retrieve complete wallet statistics for a master public key', async () => {
    const wallet = new Wallet(esplora);

    const masterPublicKey = await wallet.getMasterPublicKey(testMnemonic);
    const walletStatistics = await wallet.fetchWalletStats(masterPublicKey);

    expect(walletStatistics).toHaveProperty('balance'); // Confirmed balance
    expect(walletStatistics).toHaveProperty('pendingBalance'); // Mempool balance
    expect(walletStatistics).toHaveProperty('nextUnusedAddress');
    expect(walletStatistics).toHaveProperty('nextUnusedChangeAddress');
    expect(walletStatistics).toHaveProperty('addresses');
    expect(walletStatistics).toHaveProperty('changeAddresses');
    expect(walletStatistics).toHaveProperty('addressesWithUtxo');
  });

  it('populates the fetched addresses with useful metadata', async () => {
    const wallet = new Wallet(esplora);

    const masterPublicKey = await wallet.getMasterPublicKey(testMnemonic);
    const walletStatistics = await wallet.fetchWalletStats(masterPublicKey);

    const {
      addresses,
      changeAddresses,
      nextUnusedChangeAddress,
      nextUnusedAddress,
      addressesWithUtxo,
    } = walletStatistics;

    for (const addressMetadata of [
      addresses[0],
      changeAddresses[0],
      addressesWithUtxo[0],
      nextUnusedAddress,
      nextUnusedChangeAddress,
    ]) {
      expect(typeof addressMetadata.address).toBe('string');
      expect(typeof addressMetadata.derivationPath).toBe('string');
      expect(addressMetadata.publicKey).toBeInstanceOf(Buffer);
    }
  });

  it('can fetch utxos', async () => {
    const wallet = new Wallet(esplora);

    const masterPublicKey = await wallet.getMasterPublicKey(testMnemonic);
    const walletStatistics = await wallet.fetchWalletStats(masterPublicKey);

    const utxos = await wallet.fetchUtxos(walletStatistics.addressesWithUtxo);
    const utxo = utxos[0];

    expect(typeof utxo.address).toBe('string');
    expect(typeof utxo.derivationPath).toBe('string');
    expect(typeof utxo.txid).toBe('string');
    expect(typeof utxo.value).toBe('number');
    expect(typeof utxo.vout).toBe('number');
  });

  it('can create a signed transaction', async () => {
    const wallet = new Wallet(esplora);

    const masterPublicKey = await wallet.getMasterPublicKey(testMnemonic);
    const walletStatistics = await wallet.fetchWalletStats(masterPublicKey);

    const transactionMetadata = await wallet.createTransaction(
      walletStatistics.addressesWithUtxo,
      { address: '3Qfh9KXTRyJ33aHGb9b66X6UHeZqAKQu1t', value: 40000 },
      40,
      walletStatistics.nextUnusedChangeAddress.address,
      testMnemonic,
    );

    expect(transactionMetadata).toBeDefined();
  });
});
