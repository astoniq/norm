import {FC} from "react";
import {TFuncKey} from "i18next";
import {Optional} from "@astoniq/essentials";
import {BarGraphIcon} from "../../icons/BarGraphIcon.tsx";

export type AppItem = {
    Icon: FC;
    title: TFuncKey;
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
            title: 'projects',
            Icon: BarGraphIcon
        },
        {
            title: 'users',
            Icon: BarGraphIcon
        },
        {
            title: 'settings',
            Icon: BarGraphIcon
        }
    ];

    const enabledItems = allItems.filter(item => !item.isHidden);

    return {
        items: enabledItems, firstItem: findFirstItem(enabledItems)
    }
}