import { Fill, Cancel } from "../../generated/Exchange/Exchange";
import { loadAsset } from "../models/Asset";
import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  log,
} from "@graphprotocol/graph-ts";
import { createCancelOrder, createFillOrder } from "../models/ZeroXOrder";
import { ERC20PROXYID, ERC721PROXYID } from "../utils/order";
import { Asset } from "../../generated/schema";

export function handleFill(event: Fill): void {
  let makerAssetData = event.params.makerAssetData;
  let takerAssetData = event.params.takerAssetData;

  let makerAssetProxyId = makerAssetData.toHex().substr(0, 10);
  let takerAssetProxyId = takerAssetData.toHex().substr(0, 10);

  log.info("makerAssetProxyId: {} takerAssetProxyId:{}", [
    makerAssetProxyId,
    takerAssetProxyId,
  ]);

  if (makerAssetProxyId == ERC721PROXYID && takerAssetProxyId == ERC20PROXYID) {
    // it's ERC721 <-> ERC20 exchange
    let makerTokenAddress = Address.fromHexString(
      "0x" + makerAssetData.toHex().substr(10, 32)
    );

    log.info("makerTokenAddress: {} ", [makerTokenAddress.toHex()]);

    //    if (makerTokenAddress === ERC721ADDRESS) {
    let assetIdHex = "0x" + makerAssetData.toHex().substr(42, 72);
    let assetId = BigInt.fromUnsignedBytes(
      ByteArray.fromHexString(assetIdHex) as Bytes
    );

    let asset = loadAsset(assetId);
    if (asset != null) {
      createFillOrder(asset as Asset, event);
    }
    //    }
  }
}

export function handleCancel(event: Cancel): void {
  let makerAssetData = event.params.makerAssetData;
  let takerAssetData = event.params.takerAssetData;

  let makerAssetProxyId = makerAssetData.toHex().substr(0, 10);
  let takerAssetProxyId = takerAssetData.toHex().substr(0, 10);

  if (makerAssetProxyId == ERC721PROXYID && takerAssetProxyId == ERC20PROXYID) {
    // it's ERC721 <-> ERC20 exchange

    let makerTokenAddress = Address.fromHexString(
      "0x" + makerAssetData.toHex().substr(10, 32)
    );

    //if (makerTokenAddress === ERC721ADDRESS) {
    let assetIdHex = "0x" + makerAssetData.toHex().substr(42, 72);
    let assetId = BigInt.fromUnsignedBytes(
      ByteArray.fromHexString(assetIdHex) as Bytes
    );

    let asset = loadAsset(assetId);
    if (asset != null) {
      createCancelOrder(asset as Asset, event);
    }
    //}
  }
}
