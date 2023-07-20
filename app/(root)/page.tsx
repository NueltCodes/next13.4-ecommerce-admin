"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/useStoreModal";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return <div className="p-4">Root</div>;
};
export default SetupPage;
