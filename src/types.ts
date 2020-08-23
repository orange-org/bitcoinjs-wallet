export type AddressTxs = {
  txId: string;
  vout: number;
  value: number;
  status: { confirmed: boolean };
};
