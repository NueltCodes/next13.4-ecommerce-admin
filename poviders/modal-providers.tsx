"use client";

import React from "react";
import { useEffect, useState } from "react";
const ModalProviders = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <div>modal-providers</div>;
};

export default ModalProviders;
