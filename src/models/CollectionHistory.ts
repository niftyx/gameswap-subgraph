import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Collection, CollectionHistory, User } from "../../generated/schema";

export function createCollectionHistory(
  txId: Bytes,
  collection: Collection,
  timestamp: BigInt,
  user: User
): void {
  let history = new CollectionHistory(txId.toHex());
  history.ownerId = user.id;
  history.owner = user.id;
  history.timestamp = timestamp;
  history.collection = collection.id;
  history.txHash = txId;
  history.save();
}
