"use client";
import React from "react";
import { useDarkMode } from "../context/DarkModeContext";

const WaitForDarkMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useDarkMode();
  if (darkMode === null) return null;
  return <>{children}</>;
};

export default WaitForDarkMode;
