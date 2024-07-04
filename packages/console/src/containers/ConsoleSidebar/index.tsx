import styles from './index.module.css';
import {useAppMenuItems} from "./hook.tsx";
import {matchPath, useLocation, useNavigate} from "react-router-dom";
import kebabCase from "just-kebab-case";
import {Logo} from "../../components/Logo";
import {TopbarItem} from "../../components/TopbarItem";
import {useCallback} from "react";
import {joinPath} from "@astoniq/essentials";

export function AppTopbar() {

    const {items} = useAppMenuItems();

    const location = useLocation()

    const match = useCallback(
        (pathname: string, exact = false) => {
            return (
                matchPath(joinPath( kebabCase(pathname), exact ? '' : '*'), location.pathname) !==
                null
            );
        },
        [location.pathname]
    );


    const navigate = useNavigate();

    return (
        <div className={styles.topbar}>
            <Logo className={styles.logo} onClick={() => navigate('/')}/>
            <div className={styles.menu}>
                {items.map(({title, Icon, to, isHidden}) =>
                        !isHidden && (
                            <TopbarItem
                                key={title}
                                to={to}
                                titleKey={title}
                                icon={<Icon/>}
                                isActive={match(to)}
                            />
                        )
                )}
            </div>
        </div>
    )
}