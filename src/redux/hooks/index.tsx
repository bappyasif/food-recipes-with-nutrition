import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootStoreStateType } from "../store";

export const useAppSelector: TypedUseSelectorHook<RootStoreStateType> = useSelector

export const useAppDispatch: () => AppDispatch = useDispatch