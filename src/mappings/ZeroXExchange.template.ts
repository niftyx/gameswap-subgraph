import { assetDataUtils } from "@0x/order-utils";
import { Fill, Cancel } from "../../generated/Exchange/Exchange";
import { loadAsset } from "../models/Asset";
import { BigInt } from "@graphprotocol/graph-ts";
import { createOrder } from "../models/ZeroXOrder";
import { ZeroXOrderType } from "../utils/enum";

const ERC721ADDRESS = "{{address_erc721}}";

export function handleFill(event: Fill): void {
  const {
    params: { makerAssetData },
  } = event;
  try {
    const makerAssetInfo = assetDataUtils.decodeAssetDataOrThrow(
      makerAssetData.toString()
    );
    if (
      makerAssetInfo &&
      makerAssetInfo.assetProxyId === "0x02571792" &&
      (makerAssetInfo as any).tokenAddress === ERC721ADDRESS
    ) {
      // it's ERC721
      const assetId = (makerAssetInfo as any).tokenId as BigInt;
      const asset = loadAsset(assetId);
      if (asset) {
        createOrder(asset, ZeroXOrderType.Filled, event);
      }
    }
  } catch (error) {
    console.warn(error);
  }
}

export function handleCancel(event: Cancel): void {
  const {
    params: { makerAssetData },
  } = event;
  const makerAssetInfo = assetDataUtils.decodeAssetDataOrThrow(
    makerAssetData.toString()
  );
  if (
    makerAssetInfo &&
    makerAssetInfo.assetProxyId === "0x02571792" &&
    (makerAssetInfo as any).tokenAddress === ERC721ADDRESS
  ) {
    // it's ERC721
    const assetId = (makerAssetInfo as any).tokenId as BigInt;
    const asset = loadAsset(assetId);
    if (asset) {
      createOrder(asset, ZeroXOrderType.Filled, event);
    }
  }
}
