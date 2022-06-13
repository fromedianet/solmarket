import React from "react";
import { toast } from "react-toastify";

export function notify({
  message = "",
  description = undefined as any,
  txid = "",
  type = "info" as "info" | "warning" | "success" | "error",
}) {
  if (txid) {
    description = <></>;
  }
  const content = (
    <div
      style={{ display: "inline-flex", flexDirection: "column", width: "100%" }}
    >
      <span style={{ color: "white" }}>{message}</span>
      <span style={{ color: "white", opacity: 0.7 }}>{description}</span>
    </div>
  );
  toast(content, {
    position: "top-center",
    theme: "dark",
    autoClose: 5000,
    hideProgressBar: false,
    pauseOnFocusLoss: false,
    type: type,
  });
}
