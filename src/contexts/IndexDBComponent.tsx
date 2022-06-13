import React, { useEffect } from "react";
import { initDB } from "react-indexed-db";
import { DBConfig } from "../constants/IndexedDBConfig";

export default function IndexDBComponent() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initDB(DBConfig);
    }
  }, [window]);

  return <div></div>;
}
