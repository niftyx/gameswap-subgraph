import { Token } from "../../generated/schema";
import { Transfer, SetTokenURI } from "../../generated/Test721/Test721";
import { getOrCreateAccount, getOrCreateZeroAccount } from "../models/Account";
import { getOrCreateAsset, loadAsset } from "../models/Asset";
import { getOrCreateAssetHistory } from "../models/AssetHistory";
import { getOrCreateToken } from "../models/Token";
import { ONE } from "../utils/number";
import { ZERO_ADDRESS } from "../utils/token";

function handleMinted(token: Token, event: Transfer): void {
  token.totalSupply = token.totalSupply.plus(ONE);
  token.totalMinted = token.totalMinted.plus(ONE);
  token.save();

  // create / update account
  let account = getOrCreateAccount(
    event.params.to,
    token,
    event.block.timestamp
  );
  account.assetCount = account.assetCount.plus(ONE);
  account.save();

  // create asset
  let asset = getOrCreateAsset(
    event.params.tokenId,
    token,
    account,
    event.block.timestamp
  );

  // create asset history
  getOrCreateAssetHistory(
    account,
    asset,
    event.block.timestamp,
    event.transaction.hash
  );
}

function handleBurnt(token: Token, event: Transfer): void {
  token.totalSupply = token.totalSupply.minus(ONE);
  token.totalBurned = token.totalMinted.plus(ONE);
  token.save();

  // create / update account
  let account = getOrCreateAccount(
    event.params.from,
    token,
    event.block.timestamp
  );
  account.assetCount = account.assetCount.minus(ONE);

  account.save();

  let asset = loadAsset(event.params.tokenId);
  let zeroAccount = getOrCreateZeroAccount(token);
  if (asset) {
    asset.updateTimeStamp = event.block.timestamp;
    asset.currentOwner = zeroAccount.id;
    asset.save();
    getOrCreateAssetHistory(
      account,
      asset,
      event.block.timestamp,
      event.transaction.hash
    );
  }
}

function handleNormalTransfer(token: Token, event: Transfer): void {
  let asset = loadAsset(event.params.tokenId);
  let toAccount = getOrCreateAccount(
    event.params.to,
    token,
    event.block.timestamp
  );
  let fromAccount = getOrCreateAccount(
    event.params.from,
    token,
    event.block.timestamp
  );
  if (asset) {
    getOrCreateAssetHistory(
      toAccount,
      asset,
      event.block.timestamp,
      event.transaction.hash
    );

    asset.updateTimeStamp = event.block.timestamp;
    asset.currentOwner = toAccount.id;
    asset.save();

    fromAccount.assetCount = fromAccount.assetCount.minus(ONE);
    fromAccount.save();
    toAccount.assetCount = toAccount.assetCount.plus(ONE);
    toAccount.save();
  }
}

export function handleTokenURISet(event: SetTokenURI): void {
  let asset = loadAsset(event.params.tokenId);
  if (asset) {
    asset.updateTimeStamp = event.block.timestamp;
    asset.assetURL = event.params.tokenURI;
    asset.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let token = getOrCreateToken(event.address, event.block.timestamp);

  let isMint = event.params.from.toHex() == ZERO_ADDRESS;
  let isBurn = event.params.to.toHex() == ZERO_ADDRESS;

  if (isMint) {
    handleMinted(token, event);
  } else if (isBurn) {
    handleBurnt(token, event);
  } else {
    handleNormalTransfer(token, event);
  }
}
