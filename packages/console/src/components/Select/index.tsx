import {ReactEventHandler, ReactNode, useEffect, useMemo, useRef, useState} from "react";
import classNames from "classnames";
import {useWindowResize} from "../../hooks/use-window-resize.ts";

import styles from './index.module.css'
import {onKeyDownHandler} from "../../utils";
import IconButton from "../IconButton";
import {CloseIcon} from "../../icons/CloseIcon.tsx";
import {Dropdown} from "../Dropdown";
import {SearchIcon} from "../../icons/SearchIcon.tsx";
import {useTranslation} from "react-i18next";
import {KeyboardArrowUpIcon} from "../../icons/KeyboardArrowUpIcon.tsx";
import {KeyboardArrowDownIcon} from "../../icons/KeyboardArrowDownIcon.tsx";
import {DropdownItem} from "../DropdownItem";

export type Option<T> = {
    value: T;
    title: ReactNode;
}

export type Props<T> = {
    className?: string;
    value?: T;
    options: Array<Option<T>>,
    onChange?: (value?: T) => void;
    isReadOnly?: boolean;
    error?: string | boolean;
    placeholder?: ReactNode;
    isClearable?: boolean;
    size?: "small" | 'medium' | 'large';
    isSearchEnabled?: boolean;
}

export function Select<T extends string>(
    {
        className,
        value,
        options,
        onChange,
        isReadOnly,
        error,
        placeholder,
        isClearable,
        size = 'large',
        isSearchEnabled,
    }: Props<T>
) {

    const {t} = useTranslation()
    const [isOpen, setIsOpen] = useState(false);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [searchInputContainerStyles, setSearchInputContainerStyles] = useState({});

    const anchorRef = useRef<HTMLInputElement>(null);
    const current = options.find((option) => value && option.value === value);
    const filteredOptions = useMemo(() => {
        return searchInputValue
            ? options.filter(({ value }) =>
                value.toLocaleLowerCase().includes(searchInputValue.toLocaleLowerCase())
            )
            : options;
    }, [searchInputValue, options]);

    const handleSelect = (value: T) => {
        onChange?.(value);
        setIsOpen(false);
    };

    const handleClear: ReactEventHandler<HTMLButtonElement> = (event) => {
        onChange?.(undefined);
        setIsOpen(false);
        event.stopPropagation();
    };

    const getSearchInputContainerStyles = () => {
        if (!anchorRef.current) {
            return {};
        }
        const element = anchorRef.current;
        const cs = getComputedStyle(element);
        const paddingX = Number.parseFloat(cs.paddingLeft) + Number.parseFloat(cs.paddingRight);
        const paddingY = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom);
        const borderX = Number.parseFloat(cs.borderLeftWidth) + Number.parseFloat(cs.borderRightWidth);
        const borderY = Number.parseFloat(cs.borderTopWidth) + Number.parseFloat(cs.borderBottomWidth);
        return {
            position: 'fixed',
            width: `${element.offsetWidth - paddingX - borderX}px`,
            height: `${element.offsetHeight - paddingY - borderY}px`,
            top: `${
                element.getBoundingClientRect().top +
                Number.parseFloat(cs.borderTopWidth) +
                Number.parseFloat(cs.paddingTop)
            }px`,
            left: `${
                element.getBoundingClientRect().left +
                Number.parseFloat(cs.borderLeftWidth) +
                Number.parseFloat(cs.paddingLeft)
            }px`,
            backgroundColor: cs.backgroundColor,
        };
    };

    useWindowResize(() => {
        setSearchInputContainerStyles(getSearchInputContainerStyles());
    });

    useEffect(() => {
        if (isOpen) {
            anchorRef.current?.scrollIntoView({ block: 'nearest' });
            setSearchInputContainerStyles(getSearchInputContainerStyles());
        }
    }, [isOpen]);


    return (
        <>
            <div
                ref={anchorRef}
                className={classNames(
                    styles.select,
                    styles[size],
                    isOpen && styles.open,
                    isReadOnly && styles.readOnly,
                    Boolean(error) && styles.error,
                    isClearable && value && styles.clearable,
                    className
                )}
                role="button"
                tabIndex={0}
                onKeyDown={onKeyDownHandler(() => {
                    if (!isReadOnly) {
                        setIsOpen(true);
                    }
                })}
                onClick={() => {
                    if (!isReadOnly) {
                        setIsOpen(true);
                    }
                }}
            >
                <div className={styles.title}>{current?.title ?? placeholder}</div>
                {isClearable && (
                    <IconButton
                        className={classNames(styles.icon, styles.clear)}
                        size="small"
                        onClick={handleClear}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
                <div className={classNames(styles.icon, styles.arrow)}>
                    {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
            </div>
            <Dropdown
                isFullWidth
                anchorRef={anchorRef}
                className={styles.dropdown}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setSearchInputValue('');
                }}
            >
                {isSearchEnabled && isOpen && (
                    <div style={searchInputContainerStyles} className={styles.searchInputContainer}>
                        <SearchIcon className={styles.search} />
                        <input
                            ref={(input) => input?.focus()}
                            className={styles.searchInput}
                            value={searchInputValue}
                            role="searchbox"
                            autoComplete="off"
                            placeholder={t('general.type_to_search') || ''}
                            onChange={(event) => {
                                setSearchInputValue(event.target.value);
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        />
                    </div>
                )}
                {filteredOptions.map(({ value, title }) => (
                    <DropdownItem
                        key={value}
                        onClick={() => {
                            handleSelect(value);
                        }}
                    >
                        {title}
                    </DropdownItem>
                ))}
            </Dropdown>
        </>
    );
}