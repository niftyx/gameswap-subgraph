import { Token } from "../../generated/schema";
import {
  Transfer,
  SetTokenData,
  MetaDataChanged,
  OwnershipTransferred,
} from "../../generated/templates/Test721/Test721";
import { getOrCreateAccount, getOrCreateZeroAccount } from "../models/Account";
import { getOrCreateAsset, loadAsset } from "../models/Asset";
import { getOrCreateAssetHistory } from "../models/AssetHistory";
import {
  getToken,
  updateTokenMetaData,
  updateTokenOwner,
} from "../models/Token";
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

export function handleTokenDataSet(event: SetTokenData): void {
  let asset = loadAsset(event.params.tokenId);
  if (asset) {
    asset.updateTimeStamp = event.block.timestamp;
    asset.assetURL = event.params.tokenURI;
    asset.categoryId = event.params.categoryId;
    asset.gameId = event.params.gameId;
    asset.contentId = event.params.contentId;
    asset.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let token = getToken(event.address);

  let isMint = event.params.from.toHex() == ZERO_ADDRESS;
  let isBurn = event.params.to.toHex() == ZERO_ADDRESS;

  if (token !== null) {
    if (isMint) {
      handleMinted(token, event);
    } else if (isBurn) {
      handleBurnt(token, event);
    } else {
      handleNormalTransfer(token, event);
    }
  }
}

export function handleMetaDataChanged(event: MetaDataChanged): void {
  updateTokenMetaData(
    event.address,
    event.params.imageURL,
    event.params.description,
    event.params.shortUrl,
    event.block.timestamp
  );
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  updateTokenOwner(event.address, event.params.newOwner, event.block.timestamp);
}
