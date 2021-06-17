import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Collection, User } from "../../generated/schema";
import { ZERO } from "../utils/number";

export function getCollection(address: Address): Collection {
  let token = Collection.load(address.toHex());
  if (token != null) {
    return token as Collection;
  }
  return null;
}

export function createCollection(
  address: Address,
  timestamp: BigInt,
  name: string,
  symbol: string,
  infoUrl: string,
  gameId: string,
  isPrivate: boolean,
  user: User
): Collection {
  let collection = new Collection(address.toHex());

  collection.address = address;
  collection.name = name;
  collection.symbol = symbol;
  collection.infoUrl = infoUrl;
  collection.gameId = gameId;
  collection.ownerId = user.id;

  collection.totalSupply = ZERO;
  collection.totalMinted = ZERO;
  collection.totalBurned = ZERO;
  collection.isPrivate = isPrivate;
  collection.createTimeStamp = timestamp;
  collection.updateTimeStamp = timestamp;

  collection.owner = user.id;

  collection.save();

  return collection as Collection;
}
