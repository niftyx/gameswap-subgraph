import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";
import { Account, Token } from "../../generated/schema";
import { ZERO } from "../utils/number";
import { ZERO_ADDRESS } from "../utils/token";

export function getOrCreateAccount(
  accountAddress: Bytes,
  token: Token,
  timestamp: BigInt
): Account {
  let accountId = accountAddress.toHex();
  let existingAccount = Account.load(accountId);

  if (existingAccount != null) {
    return existingAccount as Account;
  }

  let newAccount = new Account(accountId);
  newAccount.address = accountAddress;
  newAccount.assetCount = ZERO;
  newAccount.token = token.id;
  newAccount.createTimeStamp = timestamp;
  newAccount.save();

  return newAccount;
}

export function getOrCreateZeroAccount(token: Token): Account {
  let accountId = ZERO_ADDRESS;
  let existingAccount = Account.load(accountId);

  if (existingAccount != null) {
    return existingAccount as Account;
  }

  let newAccount = new Account(accountId);
  newAccount.address = Bytes.fromHexString(ZERO_ADDRESS) as Bytes;
  newAccount.assetCount = ZERO;
  newAccount.token = token.id;
  newAccount.createTimeStamp = ZERO;
  newAccount.save();

  return newAccount;
}
