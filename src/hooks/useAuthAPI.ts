import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuthToken } from "../contexts/authProvider";
import { ApiUtils } from "../utils/apiUtils";

export const useAuthAPI = () => {
  const wallet = useWallet();
  const { runAPI } = ApiUtils();
  const { authToken, setAuthToken, removeAuthToken } = useAuthToken();

  function fetchNonce(wallet: string) {
    return new Promise((resolve, reject) => {
      runAPI({
        isAuth: false,
        method: "post",
        url: "/nonce/fetch",
        data: JSON.stringify({ wallet }),
      }) // @ts-ignore
        .then((res: {}) => {
          if (res["data"]["nonce"]) {
            resolve(res["data"]["nonce"]);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    });
  }

  function signin(publicKey: string, signature: string) {
    return new Promise((resolve, reject) => {
      runAPI({
        isAuth: false,
        method: "post",
        url: "/user/login",
        data: JSON.stringify({ publicKey, signature }),
      }) // @ts-ignore
        .then((res: {}) => {
          if ("data" in res) {
            resolve(res["data"]);
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  }

  async function getNonce() {
    if (wallet.publicKey) {
      try {
        const nonce = await fetchNonce(wallet.publicKey.toBase58());
        return nonce;
      } catch (e) {
        return null;
      }
    }
  }

  async function authentication() {
    const nonce = await getNonce();
    if (nonce) {
      const message =
        "Sign in with PaperCity.\n\n" +
        "No password needed.\n\n" +
        'Click "Sign" or "Approve" only means you have proved this wallet is owned by you.\n\n' +
        "This request will not trigger any blockchain transaction or cost any gas fee.\n\n" +
        "Your authentication status will be reset in 24 hours.\n\n" +
        `nonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      // @ts-ignore
      const signedMessage = await window.solana.signMessage(
        encodedMessage,
        "utf8"
      );
      const result = await signin(
        signedMessage.publicKey.toBase58(),
        bs58.encode(signedMessage.signature)
      );
      if (result) {
        // @ts-ignore
        setAuthToken(result["token"], result["user"]);
      } else {
        removeAuthToken();
      }
    }
  }

  function updateUser(params: {
    displayName: string | null;
    username: string | null;
    email: string | null;
    bio: string | null;
  }) {
    return new Promise((resolve, reject) => {
      runAPI({
        isAuth: true,
        method: "post",
        url: "/user/updateUser",
        data: JSON.stringify(params),
      })
        .then((res: any) => {
          if (res["data"]) {
            setAuthToken(authToken, res["data"]);
            resolve(res["data"]);
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  }

  return {
    authentication,
    updateUser,
  };
};
