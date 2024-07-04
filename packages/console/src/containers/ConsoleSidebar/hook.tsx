import {FC} from "react";
import {TFuncKey} from "i18next";
import {Optional} from "@astoniq/essentials";
import {BarGraphIcon} from "../../icons/BarGraphIcon.tsx";
import {To} from "react-router-dom";

export type AppItem = {
    Icon: FC;
    title: TFuncKey;
    to: To,
    isHidden?: boolean
}

const findFirstItem = (items: AppItem[]): Optional<AppItem> => {
    return items.find((item) => !item.isHidden)
};

export const useAppMenuItems = (): {
    items: AppItem[],
    firstItem: Optional<AppItem>
} => {
    const allItems: AppItem[] = [
        {
            title: 'navigation.home',
            Icon: BarGraphIcon,
            to: 'home'
        },
        {
            title: 'navigation.projects',
            Icon: BarGraphIcon,
            to: 'projects'
        },
        {
            title: 'navigation.users',
            Icon: BarGraphIcon,
            to: 'users'
        },
        {
            title: 'navigation.settings',
            Icon: BarGraphIcon,
            to: 'settings'
        }
    ];

    const enabledItems = allItems.filter(item => !item.isHidden);

    return {
        items: enabledItems, firstItem: findFirstItem(enabledItems)
    }
}