import { Wallet } from 'src/Wallet';

describe('Wallet basics', () => {
  it('has a static function that generates a mnemonic', () => {
    const mnemonic = Wallet.generateMnemonic();

    expect(mnemonic).toBe(true);
  });
});
