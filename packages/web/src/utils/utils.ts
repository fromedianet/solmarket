export const cleanName = (name?: string): string | undefined => {
  if (!name) {
    return undefined;
  }

  return name.replace(/\s+/g, '-');
};

export const getLast = <T>(arr: T[]) => {
  if (arr.length <= 0) {
    return undefined;
  }

  return arr[arr.length - 1];
};

export const getDateStringFromUnixTimestamp = (unix: number) => {
  const date = new Date(unix * 1000);
  const str = date.toLocaleString();
  return str;
};
