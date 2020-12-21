import { BigInt } from "@graphprotocol/graph-ts";

import { Asset, Account, AssetHistory } from "../../generated/schema";

export function getOrCreateAssetHistory(
  owner: Account,
  asset: Asset,
  timestamp: BigInt
): AssetHistory {
  let historyId = owner.address.toHex() + timestamp.toHex();
  let existingHistory = AssetHistory.load(historyId);

  if (existingHistory != null) {
    return existingHistory as AssetHistory;
  }

  let newHistory = new AssetHistory(historyId);
  newHistory.owner = owner.id;
  newHistory.asset = asset.id;
  newHistory.timestamp = timestamp;

  newHistory.save();

  return newHistory;
}
