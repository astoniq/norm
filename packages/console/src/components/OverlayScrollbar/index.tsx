import {OverlayScrollbarsComponent, OverlayScrollbarsComponentProps} from "overlayscrollbars-react";

export function OverlayScrollbar(props: OverlayScrollbarsComponentProps) {
    return (
        <OverlayScrollbarsComponent
            options={{scrollbars: {autoHide: 'leave', autoHideDelay: 0}}}
            {...props}
        />
    )
}