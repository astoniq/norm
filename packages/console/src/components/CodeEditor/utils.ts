import type { CSSProperties } from 'react';

export const lineNumberContainerStyle = (): CSSProperties => {
    return {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right',
        paddingLeft: '0px',
        paddingRight: '0px',
    };
};

export const lineNumberStyle = (numberOfLines: number): CSSProperties => {
    return {
        minWidth: `calc(${numberOfLines}ch + 20px)`,
        marginLeft: '0px',
        paddingRight: '20px',
        paddingLeft: '0px',
        display: 'inline-flex',
        justifyContent: 'flex-end',
        counterIncrement: 'line',
        lineHeight: '1.5',
        flexShrink: 0,
        fontFamily: "'Roboto Mono', monospace",
        fontSize: '14px',
        position: 'sticky',
        left: 0,
    };
};

export const customStyle = (width?: number): CSSProperties => {
    return {
        background: 'transparent',
        fontSize: '14px',
        margin: '0',
        padding: '0',
        borderRadius: '0',
        wordBreak: 'break-all',
        overflow: 'unset',
    };
};