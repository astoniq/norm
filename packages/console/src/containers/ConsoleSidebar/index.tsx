import styles from './index.module.css';
import {useSidebarMenuItems} from "./hook.tsx";
import {useMatch, useNavigate} from "react-router-dom";
import kebabCase from "just-kebab-case";
import {Logo} from "../../components/Logo";
import {TopbarItem} from "../../components/TopbarItem";

export function AppTopbar() {

    const {items} = useSidebarMenuItems();
    const match = (title: string) => Boolean(useMatch('/' + kebabCase(title)))

    const navigate = useNavigate();

    return (
        <div className={styles.topbar}>
            <Logo className={styles.logo} onClick={() => navigate('/')}/>
            <div className={styles.menu}>
                {items.map(({title, Icon, isHidden}) =>
                        !isHidden && (
                            <TopbarItem
                                key={title}
                                titleKey={title}
                                icon={<Icon/>}
                                isActive={match(title)}
                            />
                        )
                )}
            </div>
        </div>
    )
}