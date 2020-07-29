import { Wallet } from 'src/Wallet';

const mnemonic =
  'verify never climb able arch joy eight stand razor nuclear parade park';

describe('Wallet basics', () => {
  it('can be initialized with a BIP32 node', async () => {
    const wallet = await Wallet.fromMnemonic(mnemonic);

    expect(wallet.hdNode.chainCode).toBeDefined();
  });

  it('can generate receiving addresses', async () => {
    const wallet = await Wallet.fromMnemonic(mnemonic);

    wallet.generateAddress();
    wallet.generateAddress();

    expect(wallet.addresses[0]).toEqual(
      'bc1q0us48prke8q5duz0rm45z9aax3aztsd6xde6l9',
    );
    expect(wallet.addresses[1]).toEqual(
      'bc1q87acgzdfkcsgkkrmq69cx3p3ddkk57e36u0dc0',
    );
  });
});
