export function omit<T extends object, K extends keyof T>(obj: T, ...keys: Array<K>): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}
