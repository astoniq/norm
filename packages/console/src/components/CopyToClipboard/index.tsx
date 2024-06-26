import {CSSProperties, ForwardedRef, forwardRef, MouseEventHandler, useMemo, useRef, useState} from "react";
import classNames from "classnames";
import styles from './index.module.css'
import {onKeyDownHandler} from "../../utils/a11y.ts";
import IconButton from "../IconButton";
import {CopyIcon} from "../../icons/CopyIcon.tsx";
import {EyeClosedIcon} from "../../icons/EyeClosedIcon.tsx";
import {EyeIcon} from "../../icons/EyeIcon.tsx";

export type CopyToClipboardProps = {
    value: string;
    className?: string;
    style?: CSSProperties;
    valueStyle?: CSSProperties;
    readonly variant?: 'text' | 'contained' | 'border' | 'icon';
    readonly hasVisibilityToggle?: boolean;
    readonly size?: 'default' | 'small';
    readonly displayType?: 'block' | 'inline';
    readonly isWordWrapAllowed?: boolean;
}


function CopyToClipboard(
    {
        value,
        className,
        style,
        valueStyle,
        hasVisibilityToggle,
        variant = 'contained',
        size = 'default',
        isWordWrapAllowed = false,
        displayType = 'inline',
    }: CopyToClipboardProps,
    ref: ForwardedRef<HTMLDivElement>
) {
    const copyIconReference = useRef<HTMLButtonElement>(null);
    const [showHiddenContent, setShowHiddenContent] = useState(false);

    const displayValue = useMemo(() => {
        if (!hasVisibilityToggle || showHiddenContent) {
            return value;
        }

        return '•'.repeat(value.length);
    }, [hasVisibilityToggle, showHiddenContent, value]);


    const copy: MouseEventHandler<HTMLButtonElement> = async () => {
        /**
         * Note: should blur the copy icon button before the tooltip is shown, or it will remain focused after the tooltip is closed.
         */
        copyIconReference.current?.blur();
        await navigator.clipboard.writeText(value);
    };

    const toggleHiddenContent = () => {
        setShowHiddenContent((previous) => !previous);
    };

    return (
        <div
            ref={ref}
            className={classNames(
                styles.container,
                styles[variant],
                styles[size],
                styles[displayType],
                className
            )}
            role="button"
            tabIndex={0}
            style={style}
            onKeyDown={onKeyDownHandler((event) => {
                event.stopPropagation();
            })}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <div className={styles.row}>
                {variant !== 'icon' && (
                    <div
                        className={classNames(styles.content, isWordWrapAllowed && styles.wrapContent)}
                        style={valueStyle}
                    >
                        {displayValue}
                    </div>
                )}
                {hasVisibilityToggle && (
                    <IconButton
                        className={styles.iconButton}
                        iconClassName={styles.icon}
                        size="small"
                        onClick={toggleHiddenContent}
                    >
                        {showHiddenContent ? <EyeClosedIcon/> : <EyeIcon/>}
                    </IconButton>
                )}
                    <IconButton
                        ref={copyIconReference}
                        className={styles.iconButton}
                        iconClassName={styles.icon}
                        size="small"
                        onClick={copy}
                    >
                        <CopyIcon/>
                    </IconButton>
            </div>
        </div>
    );
}

export default forwardRef(CopyToClipboard);