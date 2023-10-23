import { FiltersTypes } from "@/types";
import React, { createContext } from "react";

const data: FiltersTypes = {}

export const FiltersContext = createContext(data)