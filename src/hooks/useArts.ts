import { useEffect, useState } from "react";

const cachedImages = new Map<string, string>();
export const useCachedImage = (uri: string, cacheMesh?: boolean) => {
  const [cachedBlob, setCachedBlob] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!uri) {
      return;
    }

    const result = cachedImages.get(uri);

    if (result) {
      setCachedBlob(result);
      return;
    }

    (async () => {
      let response: Response;
      let blob: Blob;
      try {
        response = await fetch(uri, { cache: "force-cache" });

        blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("No content");
        }
      } catch {
        try {
          response = await fetch(uri, { cache: "reload" });
          blob = await response.blob();
        } catch {
          // If external URL, just use the uri
          if (uri?.startsWith("http")) {
            setCachedBlob(uri);
          }
          setIsLoading(false);
          return;
        }
      }

      if (blob.size === 0) {
        setIsLoading(false);
        return;
      }

      // if (cacheMesh) {
      //   // extra caching for meshviewer
      //   Cache.enabled = true;
      //   Cache.add(uri, await blob.arrayBuffer());
      // }
      const blobURI = URL.createObjectURL(blob);
      cachedImages.set(uri, blobURI);
      setCachedBlob(blobURI);
      setIsLoading(false);
    })();
  }, [uri, setCachedBlob, setIsLoading]);

  return { cachedBlob, isLoading };
};
