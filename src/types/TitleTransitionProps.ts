import React from "react";
import { Variants } from "framer-motion";

export interface TitleTransitionProps {
  children: React.ReactNode;
  id: number;
  titleVariants: Variants;
  logo_top: number;
  title_left: number;
  classTitle: string;
}
