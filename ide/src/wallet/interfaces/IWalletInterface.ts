export interface IWalletInterface {
  connect(): Promise<string>;
  signTransaction?(tx: any): Promise<any>; // Optional placeholder for signing
  checkConnection?(): Promise<string | null>;
}
