declare module "base64-arraybuffer" {
  export function encode(arrayBuffer: ArrayBuffer): string;
  export function decode(base64: string): ArrayBuffer;
}
