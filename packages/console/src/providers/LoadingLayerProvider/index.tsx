import {useContext} from "react";
import PageContext from "../PageContextProvider/PageContext.tsx";
import {useDebouncedLoader} from "use-debounced-loader";
import {Outlet} from "react-router-dom";
import {LoadingLayer} from "../../components/LoadingLayer";


export const LoadingLayerProvider = () => {
    const {loading} = useContext(PageContext)
    const debouncedLoading = useDebouncedLoader(loading, 500)

    return (
        <>
            <Outlet/>
            {debouncedLoading && LoadingLayer}
        </>
    )
}