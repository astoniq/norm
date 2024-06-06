import {useContext} from "react";
import PageContext from "../providers/PageContextProvider/PageContext.tsx";


export const usePlatform = () => {
    const {platform} = useContext(PageContext)

    return {isMobile: platform === 'mobile', platform}
}