import { ObjectId } from "mongodb";
import { env } from "../env";

const BASE_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const BASE = BASE_CHARS.length;
const CODE_LENGTH = 7;

export const encode = (id: number): string => {
  const shuffled = shuffle(id);
  let result = "";
  let value = shuffled;

  for (let i = 0; i < CODE_LENGTH; i++) {
    result = BASE_CHARS[value % BASE] + result;
    value = Math.floor(value / BASE);
  }

  return result;
};

export const shuffle = (id: number): number => {
  let n = (id ^ env.SHUFFLE_SECRET) >>> 0;

  n = (((n >>> 16) ^ n) * 0x45d9f3b) >>> 0;
  n = (((n >>> 16) ^ n) * 0x45d9f3b) >>> 0;
  n = ((n >>> 16) ^ n) >>> 0;

  return n;
};

export const objectIdToNumber = (id: ObjectId): number => {
  const hex = id.toHexString(); // 24 chars = 12 bytes

  const full = BigInt("0x" + hex);

  const hi = (full >> 64n) & 0xffffffffn;
  const mid = (full >> 32n) & 0xffffffffn;
  const lo = full & 0xffffffffn;

  return Number(hi ^ mid ^ lo);
};
