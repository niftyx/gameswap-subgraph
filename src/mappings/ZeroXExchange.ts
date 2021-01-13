import { Fill, Cancel } from "../../generated/Exchange/Exchange";
import { loadAsset } from "../models/Asset";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createCancelOrder, createFillOrder } from "../models/ZeroXOrder";

let ERC721ADDRESS = Address.fromHexString("0x254D5259539b3ec85Cd76A1931899ec7E8851dD4");

export function handleFill(event: Fill): void {
  let makerAssetData = event.params.makerAssetData;
  let takerAssetData = event.params.takerAssetData;

  let makerAssetProxyId = makerAssetData.toHex().substr(0, 10);
  let takerAssetProxyId = takerAssetData.toHex().substr(0, 10);

  if (
    makerAssetProxyId === "0x02571792" &&
    takerAssetProxyId === "0xf47261b0"
  ) {
    // it's ERC721 <-> ERC20 exchange
    let makerTokenAddress = Address.fromHexString(
      "0x" + makerAssetData.toHex().substr(10, 32)
    );

    if (makerTokenAddress === ERC721ADDRESS) {
      let assetIdHex = "0x" + makerAssetData.toHex().substr(42, 72);
      let assetId = BigInt.fromI32(assetIdHex as i32);

      let asset = loadAsset(assetId);
      if (asset) {
        createFillOrder(asset, event);
      }
    }
  }
}

export function handleCancel(event: Cancel): void {
  let makerAssetData = event.params.makerAssetData;
  let takerAssetData = event.params.takerAssetData;

  let makerAssetProxyId = makerAssetData.toHex().substr(0, 10);
  let takerAssetProxyId = takerAssetData.toHex().substr(0, 10);

  if (
    makerAssetProxyId === "0x02571792" &&
    takerAssetProxyId === "0xf47261b0"
  ) {
    // it's ERC721 <-> ERC20 exchange

    let makerTokenAddress = Address.fromHexString(
      "0x" + makerAssetData.toHex().substr(10, 32)
    );

    if (makerTokenAddress === ERC721ADDRESS) {
      let assetIdHex = "0x" + makerAssetData.toHex().substr(42, 72);
      let assetId = BigInt.fromI32(assetIdHex as i32);

      let asset = loadAsset(assetId);
      if (asset) {
        createCancelOrder(asset, event);
      }
    }
  }
}
