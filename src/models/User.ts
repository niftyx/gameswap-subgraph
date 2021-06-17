import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";
import { ZERO } from "../utils/number";

export function getOrCreateUser(
  address: Bytes,
  timestamp: BigInt
): User {
  let userId = address.toHex();
  let existingUser = User.load(userId);

  if (existingUser != null) {
    return existingUser as User;
  }

  let newUser = new User(userId);
  newUser.address = address;
  newUser.assetCount = ZERO;
  newUser.collectionCount = ZERO;
  newUser.createTimeStamp = timestamp;
  newUser.updateTimeStamp = timestamp;
  newUser.save();

  return newUser as User;
}
