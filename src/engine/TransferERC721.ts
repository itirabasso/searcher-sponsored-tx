import { BigNumber, Contract } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "./Base";

const ERC721_ABI = [{
  "constant": true,
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }],
  "name": "isApprovedForAll",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, {
    "internalType": "bool",
    "name": "approved",
    "type": "bool"
  }],
  "name": "setApprovalForAll",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "safeTransferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "transferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]


export class TransferERC721 extends Base {
  private _owner: string;
  private _recipient: string;
  private _tokens: string[][]

  constructor(
    owner: string, recipient: string,
    tokens: string[][]
  ) {
    super()
    if (!isAddress(recipient)) throw new Error("Bad Recipient Address")
    if (!isAddress(owner)) throw new Error("Bad Owner Address")
    this._owner = owner;
    this._recipient = recipient;
    this._tokens = tokens
  }

  async description(): Promise<string> {
    // return `Giving ${this._recipient} approval for: ${this._contractAddresses721.join(", ")}`
    return `Transfering all the ERC721 tokens from ${this._owner} to ${this._recipient}`
  }

  getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    return Promise.all(this._tokens.map(async ([address, id]) => {
      const erc721Contract = new Contract(address, ERC721_ABI);
      return {
        ...(await erc721Contract.populateTransaction.safeTransferFrom(
          this._owner, this._recipient, id
        ))
      }
    }))
  }
}
