import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as bjs from 'bitcoinjs-lib';

type WalletConfigNoHdNode = {
  derivationPath?: string;
  network?: bjs.Network;
};

type WalletConfig = WalletConfigNoHdNode & {
  hdNode: bip32.BIP32Interface;
};

export class Wallet {
  hdNode: bip32.BIP32Interface;

  derivationPath: string;

  network: bjs.Network;

  addresses: string[] = [];

  constructor(config: WalletConfig) {
    this.hdNode = config.hdNode;
    this.derivationPath = config.derivationPath || 'm/84/0/0';
    this.network = config.network || bjs.networks.bitcoin;
  }

  static async fromMnemonic(
    mnemonic: string,
    config: WalletConfigNoHdNode = {},
  ) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdNode = bip32.fromSeed(seed, config.network);

    return new Wallet({ ...config, hdNode });
  }

  static fromMasterPublicKey(
    masterPublicKey: string,
    config: WalletConfigNoHdNode = {},
  ) {
    const hdNode = bip32.fromBase58(masterPublicKey, config.network);

    return new Wallet({ ...config, hdNode });
  }

  /**
   * Makes network calls to 3PBP to look up the balances of addresses in this wallet.
   */
  async populateBalance() {
    throw new Error('Not implemented');
  }

  generateAddress() {
    const nextIndex = this.addresses.length;
    const childPublicKey = this.hdNode.derivePath(
      `${this.derivationPath}/0/${nextIndex}`,
    ).publicKey;
    const { address } = bjs.payments.p2wpkh({ pubkey: childPublicKey });

    if (address == undefined) {
      throw new Error('Could not create address');
    }

    this.addresses.push(address);
  }
}
