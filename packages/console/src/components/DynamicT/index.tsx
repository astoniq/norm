import {TFuncKey} from "i18next";
import {useTranslation} from "react-i18next";

type Props = {
    readonly forKey: TFuncKey<'translation', 'console'>;
    readonly interpolation?: Record<string, unknown>
}

export function DynamicT({forKey, interpolation}: Props) {
    const {t} = useTranslation(undefined, {keyPrefix: 'console'});

    return <>{t(forKey, interpolation ?? {})}</>;
}