export enum ZeroXOrderType {
  Filled,
  Cancelled,
}

export function mapZeroXOrderType(type: ZeroXOrderType): string {
  switch (type) {
    case ZeroXOrderType.Filled:
      return "Filled";
    case ZeroXOrderType.Cancelled:
      return "Cancelled";
    default:
      return "";
  }
}
