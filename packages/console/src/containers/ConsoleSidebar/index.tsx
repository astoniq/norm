import {OverlayScrollbar} from "../../components/OverlayScrollbar";

import styles from './index.module.css';
import {useSidebarMenuItems} from "./hook.tsx";
import {SidebarItem} from "./components/Item";
import {useMatch} from "react-router-dom";
import kebabCase from "just-kebab-case";

export function AppSidebar() {

    const {items} = useSidebarMenuItems();
    const match = (title: string) => Boolean(useMatch('/' + kebabCase(title)))

    return (
        <OverlayScrollbar className={styles.sidebar}>
            {items.map(({title, Icon, isHidden}) =>
                    !isHidden && (
                        <SidebarItem
                            key={title}
                            titleKey={title}
                            icon={<Icon/>}
                            isActive={match(title)}
                        />
                    )
            )}
        </OverlayScrollbar>
    )
}