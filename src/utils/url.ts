import { URLSearchParamsInit,useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from "react";
import { cleanObject } from '.';

// 返回 url 中指定键的参数值，支持类型推断
export const  useUrlQueryParam = <K extends string>(keys: K[]) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const keysKey = keys.join(',');
    const searchParamsKey = searchParams.toString();

    const param = useMemo(() => {
        const result = {} as { [key in K]: string };
        const currentSearchParams = new URLSearchParams(searchParamsKey);
        const keysList = keysKey ? keysKey.split(',') : [];

        keysList.forEach((key) => {
            result[key as K] = currentSearchParams.get(key) || '';
        });

        return result;
    }, [keysKey, searchParamsKey]);

    const setParam = useCallback((nextParam: Partial<{ [key in K]: unknown }>) => {
        const mergedParam = cleanObject({
            ...Object.fromEntries(searchParams),
            ...nextParam,
        }) as URLSearchParamsInit;

        return setSearchParams(mergedParam);
    }, [searchParams, setSearchParams]);

    return [param, setParam] as const;
};

export const useSetUrlQueryParam = <K extends string>() => {
    const [searchParams, setSearchParams] = useSearchParams();

    return useCallback(
        (nextParam: Partial<{ [key in K]: unknown }>) => {
            const mergedParam = cleanObject({
                ...Object.fromEntries(searchParams),
                ...nextParam,
            }) as URLSearchParamsInit;

            return setSearchParams(mergedParam);
        },
        [searchParams, setSearchParams]
    );
};