import { AppDispatch, RootStoreStateType } from "@/redux/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<RootStoreStateType> = useSelector

export const useAppDispatch: () => AppDispatch = useDispatch