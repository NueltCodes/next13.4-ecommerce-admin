"use client";

import { StoreModal } from "@/components/modals/store-modal";
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
  return (
    <>
      <StoreModal />
    </>
  );
};

export default ModalProviders;
