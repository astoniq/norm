import classNames from 'classnames';
import { Toaster, resolveValue } from 'react-hot-toast';


import  styles from './index.module.css';
import {ToastSuccessIcon} from "../../icons/ToastSuccessIcon";
import {ToastErrorIcon} from "../../icons/ToastErrorIcon";

function Toast() {
    return (
        <Toaster
            toastOptions={{
                className: styles.toast,
                success: {
                    className: classNames(styles.toast, styles.success),
                    icon: <ToastSuccessIcon />,
                },
                error: {
                    className: classNames(styles.toast, styles.error),
                    icon: <ToastErrorIcon />,
                },
            }}
        >
            {(toastInstance) => (
                <div className={toastInstance.className}>
                    <div className={styles.image}>{toastInstance.icon}</div>
                    <div className={styles.message}>{resolveValue(toastInstance.message, toastInstance)}</div>
                </div>
            )}
        </Toaster>
    );
}

export default Toast;