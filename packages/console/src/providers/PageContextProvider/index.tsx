import React, {useMemo, useState} from "react";
import {Platform, Theme} from "../../types";
import {isMobile} from "react-device-detect";
import {PageContextType} from "./PageContext.tsx";
import MainContext from './PageContext';

type Props = {
    readonly children: React.ReactNode;
}

export const PageContextProvider = ({children}: Props) => {

    const [loading, setLoading] = useState(false)
    const [theme, setTheme] = useState<Theme>(Theme.Light)

    const [platform, setPlatform] = useState<Platform>(
        isMobile ? 'mobile' : 'web'
    )

    const pageContext = useMemo<PageContextType>(() => ({
        loading,
        setLoading,
        theme,
        setTheme,
        platform,
        setPlatform,
    }), [ loading, platform, theme]);

    return <MainContext.Provider value={pageContext}>{children}</MainContext.Provider>
}