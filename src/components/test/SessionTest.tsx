"use client";

import { useEffect } from "react";

export default function SessionTest() {
  useEffect(() => {
    let sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("sessionId", sessionId);
      console.log("New Session Created:", sessionId);
    } else {
      console.log("Existing Session:", sessionId);
    }
  }, []);

  return null;
}