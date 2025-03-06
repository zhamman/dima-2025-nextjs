import React from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Inner from "./Inner";

export default function TransitionProvider({ children }) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Inner key={router.asPath}>{children}</Inner>
    </AnimatePresence>
  );
}
