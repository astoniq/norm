import classNames from 'classnames';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as a11yDarkTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';

import CopyToClipboard from '../CopyToClipboard';

import  styles from './index.module.css';
import { lineNumberContainerStyle, lineNumberStyle, customStyle } from './utils';

type Props = {
    readonly className?: string;
    readonly title?: string;
    readonly language?: string;
    readonly isReadonly?: boolean;
    readonly value?: string;
    readonly onChange?: (value: string) => void;
    readonly tabSize?: number;
    readonly error?: string | boolean;
    readonly placeholder?: string;
};

export function CodeEditor({
                        className,
                        title,
                        language,
                        isReadonly = false,
                        value,
                        onChange,
                        tabSize = 2,
                        error,
                        placeholder,
                    }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    useLayoutEffect(() => {
        const { current } = textareaRef;

        if (current && current.style.width !== `${current.scrollWidth}px`) {
            current.style.width = `${current.scrollWidth}px`;
        }
    }, [value]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.currentTarget;
        onChange?.(value);
    };

    const handleKeydown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Tab') {
            const { value, selectionStart } = event.currentTarget;

            event.preventDefault();
            const newText =
                value.slice(0, selectionStart) + ' '.repeat(tabSize) + value.slice(selectionStart);

            event.currentTarget.value = newText;
            event.currentTarget.setSelectionRange(selectionStart + tabSize, selectionStart + tabSize);

            onChange?.(newText);
        }

        if (event.key === 'Enter' && editorRef.current && editorRef.current.scrollLeft !== 0) {
            editorRef.current.scrollLeft = 0;
        }
    };

    const finalErrorMessage = typeof error === 'string' ? error : t('general.required');

    const maxLineNumberDigits = (value ?? '').split('\n').length.toString().length;
    const isShowingPlaceholder = !value;

    return (
        <>
            <div className={classNames(styles.container, className)}>
                {title && <pre className={styles.title}>{title}</pre>}
                {isShowingPlaceholder && <div className={styles.placeholder}>{placeholder}</div>}
                <CopyToClipboard value={value ?? ''} variant="icon" className={styles.copy} />
                <div ref={editorRef} className={classNames(styles.editor, isReadonly && styles.readonly)}>
                    <textarea
                        ref={textareaRef}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        data-gramm="false"
                        wrap="false"
                        readOnly={isReadonly}
                        spellCheck="false"
                        value={value}
                        style={
                            isShowingPlaceholder
                                ? { marginLeft: '8px', width: 'calc(100% - 8px)' }
                                : {
                                    marginLeft: `calc(${maxLineNumberDigits}ch + 20px)`,
                                    width: `calc(100% - ${maxLineNumberDigits}ch - 20px)`,
                                }
                        }
                        onChange={handleChange}
                        onKeyDown={handleKeydown}
                    />
                    <SyntaxHighlighter
                        showInlineLineNumbers
                        showLineNumbers={!isShowingPlaceholder}
                        width={textareaRef.current?.scrollWidth ?? 0}
                        lineNumberContainerStyle={lineNumberContainerStyle()}
                        lineNumberStyle={lineNumberStyle(maxLineNumberDigits)}
                        codeTagProps={{
                            style: {
                                fontFamily: "'Roboto Mono', monospace",
                            },
                        }}
                        customStyle={customStyle(textareaRef.current?.scrollWidth)}
                        language={language}
                        style={a11yDarkTheme}
                    >
                        {value ?? ''}
                    </SyntaxHighlighter>
                </div>
            </div>
            {error && <div className={styles.errorMessage}>{finalErrorMessage}</div>}
        </>
    );
}