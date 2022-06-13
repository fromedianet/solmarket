import React, { Ref, useCallback, useEffect, useState } from "react";
import { Image } from "antd";
import { MeshViewer } from "../MeshViewer";
import { ThreeDots } from "../CardLoader";
import { Stream, StreamPlayerApi } from "@cloudflare/stream-react";
import { PublicKey } from "@solana/web3.js";
import { getLast } from "../../utils/utils";
import styled from "styled-components";
import { pubkeyToString } from "../../utils/ids";
import { MetadataCategory, MetadataFile } from "../../models/metadata";
import { useCachedImage } from "../../hooks/useArts";
import { useInView } from "react-intersection-observer";

const MeshArtContent = ({
  uri,
  animationUrl,
  className,
  style,
  files,
}: {
  uri?: string;
  animationUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
}) => {
  const renderURL =
    files && files.length > 0 && typeof files[0] === "string"
      ? files[0]
      : animationUrl;
  const { isLoading } = useCachedImage(renderURL || "", true);

  if (isLoading) {
    return (
      <CachedImageContent
        uri={uri}
        className={className}
        preview={false}
        style={{ width: "100%", ...style }}
      />
    );
  }

  return <MeshViewer url={renderURL} className={className} style={style} />;
};

export const CachedImageContent = ({
  uri,
  className,
  preview,
  style,
}: {
  uri?: string;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
}) => {
  // const { cachedBlob } = useCachedImage(uri || '');

  return (
    <Image
      fallback="/image-placeholder.svg"
      src={uri}
      preview={preview}
      wrapperClassName={className}
      loading="lazy"
      wrapperStyle={{ ...style }}
      placeholder={<ThreeDots />}
      alt={uri}
      // crossOrigin="anonymous"
    />
  );
};

const VideoArtContent = ({
  className,
  style,
  files,
  uri,
  animationURL,
  active,
}: {
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
  uri?: string;
  animationURL?: string;
  active?: boolean;
}) => {
  const [playerApi, setPlayerApi] = useState<StreamPlayerApi>();

  const playerRef = useCallback(
    (ref) => {
      setPlayerApi(ref);
    },
    [setPlayerApi]
  );

  useEffect(() => {
    if (playerApi) {
      playerApi.currentTime = 0;
    }
  }, [active, playerApi]);

  const likelyVideo = (files || []).filter((f, index, arr) => {
    if (typeof f !== "string") {
      return false;
    }

    // TODO: filter by fileType
    return arr.length >= 2 ? index === 1 : index === 0;
  })?.[0] as string;

  const content =
    likelyVideo &&
    likelyVideo.startsWith("https://watch.videodelivery.net/") ? (
      <div className={`${className} square`}>
        <Stream
          // @ts-ignore
          streamRef={(e: any) => playerRef(e)}
          src={likelyVideo.replace("https://watch.videodelivery.net/", "")}
          loop={true}
          // @ts-ignore
          height={600}
          // @ts-ignore
          width={600}
          controls={false}
          videoDimensions={{
            videoHeight: 700,
            videoWidth: 400,
          }}
          autoplay={true}
          muted={true}
        />
      </div>
    ) : (
      <div className={`${className} square`}>
        <video
          playsInline={true}
          autoPlay={true}
          muted={true}
          controls={true}
          controlsList="nodownload"
          style={style}
          loop={true}
          poster={uri}
        >
          {likelyVideo && (
            <source src={likelyVideo} type="video/mp4" style={style} />
          )}
          {animationURL && (
            <source src={animationURL} type="video/mp4" style={style} />
          )}
          {files
            ?.filter((f) => typeof f !== "string")
            .map((f: any, index: number) => (
              <source key={index} src={f.uri} type={f.type} style={style} />
            ))}
        </video>
      </div>
    );

  return content;
};

const HTMLWrapper = styled.div`
  padding-top: 100%;
  position: relative;
  width: 100%;
`;

const HTMLContent = ({
  uri,
  animationUrl,
  className,
  preview,
  style,
  files,
  artview,
}: {
  uri?: string;
  animationUrl?: string;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
  artview?: boolean;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  if (!artview) {
    return (
      <CachedImageContent
        uri={uri}
        className={className}
        preview={preview}
        style={style}
      />
    );
  }
  const htmlURL =
    files && files.length > 0 && typeof files[0] === "string"
      ? files[0]
      : animationUrl;
  return (
    <HTMLWrapper>
      {!loaded && (
        <ThreeDots
          style={{
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            position: "absolute",
          }}
        />
      )}
      <iframe
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts"
        frameBorder="0"
        src={htmlURL}
        className={`html-iframe ${className}`}
        onLoad={() => {
          setLoaded(true);
        }}
        style={{
          ...style,
          height: !loaded ? 0 : "100%",
        }}
      ></iframe>
    </HTMLWrapper>
  );
};

const ArtContentWrapper = styled.div`
  display: flex;
  alignitems: center;
  justifycontent: center;
  height: 100%;
`;

export const ArtContent = ({
  category,
  className,
  preview,
  style,
  active,
  allowMeshRender,
  pubkey,
  uri,
  animationURL,
  files,
  artview,
}: {
  category?: MetadataCategory;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  ref?: Ref<HTMLDivElement>;
  active?: boolean;
  allowMeshRender?: boolean;
  pubkey?: PublicKey | string;
  uri?: string;
  animationURL?: string;
  files?: (MetadataFile | string)[];
  artview?: boolean;
}) => {
  const [uriState, setUriState] = useState<string | undefined>();
  const [animationURLState, setAnimationURLState] = useState<
    string | undefined
  >();
  const [filesState, setFilesState] = useState<
    (MetadataFile | string)[] | undefined
  >();
  const [categoryState, setCategoryState] = useState<
    MetadataCategory | undefined
  >();

  const id = pubkeyToString(pubkey);

  const { ref } = useInView({ root: null, rootMargin: "-100px 0px" });

  useEffect(() => {
    setUriState(uri);
  }, [uri]);

  useEffect(() => {
    setAnimationURLState(animationURL);
  }, [animationURL]);

  useEffect(() => {
    setFilesState(files);
  }, [files]);

  useEffect(() => {
    setCategoryState(category);
  }, [category]);

  const animationUrlExt = new URLSearchParams(
    getLast((animationURLState || "").split("?"))
  ).get("ext");

  if (
    allowMeshRender &&
    (categoryState === "vr" ||
      animationUrlExt === "glb" ||
      animationUrlExt === "gltf")
  ) {
    return (
      <MeshArtContent
        uri={uriState}
        animationUrl={animationURLState}
        className={className}
        style={style}
        files={filesState}
      />
    );
  }

  if (categoryState === "html" || animationUrlExt === "html") {
    return (
      <HTMLContent
        uri={uriState}
        animationUrl={animationURLState}
        className={className}
        preview={preview}
        style={style}
        files={filesState}
        artview={artview}
      />
    );
  }

  const content =
    categoryState === "video" ? (
      <VideoArtContent
        className={className}
        style={style}
        files={filesState}
        uri={uriState}
        animationURL={animationURLState}
        active={active}
      />
    ) : (
      <CachedImageContent
        uri={uriState}
        className={className}
        preview={preview}
        style={style}
      />
    );

  return <ArtContentWrapper ref={ref as any}>{content}</ArtContentWrapper>;
};