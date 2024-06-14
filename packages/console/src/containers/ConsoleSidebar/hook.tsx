import {FC} from "react";
import {TFuncKey} from "i18next";
import {Optional} from "@astoniq/essentials";
import {BarGraphIcon} from "../../icons/BarGraphIcon.tsx";

export type SidebarItem = {
    Icon: FC;
    title: TFuncKey<'translation, console.tabs'>;
    isHidden?: boolean
}

const findFirstItem = (items: SidebarItem[]): Optional<SidebarItem> => {
    return items.find((item) => !item.isHidden)
};

export const useSidebarMenuItems = (): {
    items: SidebarItem[],
    firstItem: Optional<SidebarItem>
} => {
    const allItems: SidebarItem[] = [
        {
            title: 'dashboard',
            Icon: BarGraphIcon
        },
        {
            title: 'projects',
            Icon: BarGraphIcon
        },
        {
            title: 'members',
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