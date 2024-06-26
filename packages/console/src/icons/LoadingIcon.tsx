import {IconProps} from "../types";

export const LoadingIcon = ({className}: IconProps) => {
    return (
        <svg
            className={className}
            width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.48" x="15" width="2" height="8" rx="1" fill="currentColor"/>
            <rect opacity="0.96" x="15" y="24" width="2" height="8" rx="1" fill="currentColor"/>
            <rect opacity="0.72" y="17" width="2" height="8" rx="1" transform="rotate(-90 0 17)" fill="currentColor"/>
            <rect opacity="0.24" x="24" y="17" width="2" height="8" rx="1" transform="rotate(-90 24 17)"
                  fill="currentColor"/>
            <rect opacity="0.32" x="29.3564" y="7.13403" width="2" height="8" rx="1"
                  transform="rotate(60 29.3564 7.13403)" fill="currentColor"/>
            <rect opacity="0.8" x="8.57227" y="19.134" width="2" height="8" rx="1" transform="rotate(60 8.57227 19.134)"
                  fill="currentColor"/>
            <rect opacity="0.64" x="1.64355" y="8.86597" width="2" height="8" rx="1"
                  transform="rotate(-60 1.64355 8.86597)" fill="currentColor"/>
            <rect opacity="0.16" x="22.4277" y="20.866" width="2" height="8" rx="1"
                  transform="rotate(-60 22.4277 20.866)" fill="currentColor"/>
            <rect opacity="0.4" x="23.1338" y="1.64355" width="2" height="8" rx="1"
                  transform="rotate(30 23.1338 1.64355)" fill="currentColor"/>
            <rect opacity="0.88" x="11.1338" y="22.4282" width="2" height="8" rx="1"
                  transform="rotate(30 11.1338 22.4282)" fill="currentColor"/>
            <rect opacity="0.56" x="7.13379" y="2.64355" width="2" height="8" rx="1"
                  transform="rotate(-30 7.13379 2.64355)" fill="currentColor"/>
            <rect opacity="0.08" x="19.1338" y="23.4282" width="2" height="8" rx="1"
                  transform="rotate(-30 19.1338 23.4282)" fill="currentColor"/>
        </svg>
    );
};