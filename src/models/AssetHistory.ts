import { BigInt, Bytes } from "@graphprotocol/graph-ts";

import { Asset, User, AssetHistory } from "../../generated/schema";

export function getOrCreateAssetHistory(
  owner: User,
  asset: Asset,
  timestamp: BigInt,
  txHash: Bytes
): AssetHistory {
  let historyId = txHash.toHex();
  let existingHistory = AssetHistory.load(historyId);

  if (existingHistory != null) {
    return existingHistory as AssetHistory;
  }

  let newHistory = new AssetHistory(historyId);
  newHistory.owner = owner.id;
  newHistory.ownerId = owner.id;
  newHistory.asset = asset.id;
  newHistory.timestamp = timestamp;
  newHistory.txHash = txHash;

  newHistory.save();

  return newHistory;
}
