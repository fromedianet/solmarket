export function maskAddress(addr?: string) {
  const nChars = 6;
  if (!addr) {
    return "";
  } else {
    const len = addr.length;
    const extra = addr.substring(nChars, len);
    return addr.replace(extra, "...");
  }
}
