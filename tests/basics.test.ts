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
      expect(addressMetadata.address).toBeInstanceOf(String);
      expect(addressMetadata.derivationPath).toBeInstanceOf(String);
      expect(addressMetadata.publicKey).toBeInstanceOf(Buffer);
    }
  });

  it('can fetch utxos', async () => {
    const wallet = new Wallet(esplora);

    const masterPublicKey = await wallet.getMasterPublicKey(testMnemonic);
    const walletStatistics = await wallet.fetchWalletStats(masterPublicKey);

    const utxos = await wallet.fetchUtxos(walletStatistics.addressesWithUtxo);
    const utxo = utxos[0];

    expect(utxo.address).toBeInstanceOf(String);
    expect(utxo.derivationPath).toBeInstanceOf(String);
    expect(utxo.txid).toBeInstanceOf(String);
    expect(utxo.value).toBeInstanceOf(Number);
    expect(utxo.vout).toBeInstanceOf(Number);
  });

  it('can create a signed transaction', async () => {
    const wallet = new Wallet(esplora);

    const masterPublicKey = await wallet.getMasterPublicKey(testMnemonic);
    const walletStatistics = await wallet.fetchWalletStats(masterPublicKey);

    const transaction = await wallet.createTransaction(
      walletStatistics.addressesWithUtxo,
      { address: 'sometargetadd', value: 40000 },
      40,
      walletStatistics.nextUnusedChangeAddress.address,
      testMnemonic,
    );

    expect(transaction).toBeDefined();
  });
});
