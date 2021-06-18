import { Bytes } from "@graphprotocol/graph-ts";
import { Asset, Collection } from "../../generated/schema";
import {
  Transfer,
  VisibilityChanged,
  OwnershipTransferred,
} from "../../generated/templates/Gswap721/Gswap721";

import { createAsset, loadAsset } from "../models/Asset";
import { getOrCreateAssetHistory } from "../models/AssetHistory";
import { getCollection } from "../models/Collection";
import { createCollectionHistory } from "../models/CollectionHistory";
import { getOrCreateUser } from "../models/User";
import { ONE } from "../utils/number";
import { ZERO_ADDRESS } from "../utils/token";

function handleMinted(collection: Collection, event: Transfer): void {
  let timestamp = event.block.timestamp;

  collection.totalSupply = collection.totalSupply.plus(ONE);
  collection.totalMinted = collection.totalMinted.plus(ONE);
  collection.updateTimeStamp = timestamp;
  collection.save();

  // create / update account
  let user = getOrCreateUser(event.params.to, event.block.timestamp);
  user.assetCount = user.assetCount.plus(ONE);
  user.updateTimeStamp = timestamp;
  user.save();

  // create asset
  let asset = createAsset(
    event.params.tokenId,
    collection,
    user,
    event.block.timestamp
  );

  // create asset history
  getOrCreateAssetHistory(
    user,
    asset,
    event.block.timestamp,
    event.transaction.hash
  );
}

function handleBurnt(collection: Collection, event: Transfer): void {
  let timestamp = event.block.timestamp;

  collection.totalSupply = collection.totalSupply.minus(ONE);
  collection.totalBurned = collection.totalMinted.plus(ONE);
  collection.updateTimeStamp = timestamp;
  collection.save();

  // create / update account
  let user = getOrCreateUser(event.params.to, event.block.timestamp);
  user.assetCount = user.assetCount.plus(ONE);
  user.updateTimeStamp = timestamp;
  user.save();

  let asset = loadAsset(event.params.tokenId);
  let zeroUser = getOrCreateUser(
    Bytes.fromHexString(ZERO_ADDRESS) as Bytes,
    timestamp
  );
  if (asset) {
    asset.updateTimeStamp = event.block.timestamp;
    asset.owner = zeroUser.id;
    asset.ownerId = zeroUser.id;
    asset.save();
    getOrCreateAssetHistory(
      user,
      asset as Asset,
      event.block.timestamp,
      event.transaction.hash
    );
  }
}

function handleNormalTransfer(collection: Collection, event: Transfer): void {
  let asset = loadAsset(event.params.tokenId);
  let timestamp = event.block.timestamp;
  let toAccount = getOrCreateUser(event.params.to, event.block.timestamp);
  let fromAccount = getOrCreateUser(event.params.from, event.block.timestamp);
  if (asset) {
    getOrCreateAssetHistory(
      toAccount,
      asset as Asset,
      event.block.timestamp,
      event.transaction.hash
    );

    asset.updateTimeStamp = timestamp;
    asset.owner = toAccount.id;
    asset.ownerId = toAccount.id;
    asset.save();

    fromAccount.assetCount = fromAccount.assetCount.minus(ONE);
    fromAccount.updateTimeStamp = timestamp;
    fromAccount.save();

    toAccount.assetCount = toAccount.assetCount.plus(ONE);
    fromAccount.updateTimeStamp = timestamp;
    toAccount.save();
  }
}

export function handleVisibilityChanged(event: VisibilityChanged): void {
  let collection = getCollection(event.address);
  if (collection) {
    collection.isPrivate = event.params.isPrivate;
    collection.updateTimeStamp = event.block.timestamp;
    collection.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let collection = getCollection(event.address);

  let isMint = event.params.from.toHex() == ZERO_ADDRESS;
  let isBurn = event.params.to.toHex() == ZERO_ADDRESS;

  if (collection != null) {
    if (isMint) {
      handleMinted(collection, event);
    } else if (isBurn) {
      handleBurnt(collection, event);
    } else {
      handleNormalTransfer(collection, event);
    }
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let collection = getCollection(event.address);
  if (collection != null) {
    let timestamp = event.block.timestamp;
    let prevOwner = getOrCreateUser(event.params.previousOwner, timestamp);
    let newOwner = getOrCreateUser(event.params.newOwner, timestamp);

    collection.ownerId = newOwner.id;
    collection.owner = newOwner.id;
    collection.updateTimeStamp = timestamp;
    collection.save();

    prevOwner.collectionCount = prevOwner.collectionCount.minus(ONE);
    prevOwner.updateTimeStamp = timestamp;
    prevOwner.save();

    newOwner.collectionCount = newOwner.collectionCount.plus(ONE);
    newOwner.updateTimeStamp = timestamp;
    newOwner.save();

    createCollectionHistory(
      event.transaction.hash,
      collection,
      timestamp,
      newOwner
    );
  }
}
