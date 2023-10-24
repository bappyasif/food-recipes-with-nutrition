import { FiltersTypes } from "@/types";
import React, { createContext } from "react";

type CtxPropTypes = {
    filters: FiltersTypes,
    handleFilterChange : (data: string, key: string) => void
}

const data: CtxPropTypes = {filters: {}, handleFilterChange: (data: string, key: string) => null}

export const FiltersContext = createContext(data)