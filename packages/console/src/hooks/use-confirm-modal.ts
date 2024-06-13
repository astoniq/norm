import {useContext} from "react";
import {AppConfirmModalContext} from "../providers/AppConfirmModalProvider";

export const useConfirmModal = () => useContext(AppConfirmModalContext);