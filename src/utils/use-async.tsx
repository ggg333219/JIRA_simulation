import { useCallback, useEffect, useRef, useState } from "react"

const useMountedRef = () => {
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return mountedRef;
}

interface State<D>{
    error:Error| null,
    data:D |null,
    stat:'idle'|'loading'|'error'|'success',
}

const defaultInitialState:State<null>={
    error:null,
    data:null,
    stat:'idle',
}

const defaultConfig = {
    throwOwnError: false,
}

export const useAsync = <D,>(initialState?: State<D>, initialConfig?: Partial<typeof defaultConfig>) => {
    const config = { ...defaultConfig, ...initialConfig }
    const [state, setState] = useState({
        ...defaultInitialState,
        ...initialState,
    })
    const mountedRef=useMountedRef()
    const [retry,setRetry]=useState(()=>()=>{})

    const run = useCallback((promiseOrFn: Promise<D> | (() => Promise<D>), runConfig?: { retry?: (() => Promise<D>) | Promise<D> }) => {
        const getPromise = () => {
            try {
                if (typeof promiseOrFn === 'function') {
                    return (promiseOrFn as () => Promise<D>)();
                }
                return promiseOrFn as Promise<D>;
            } catch (e) {
                return Promise.reject(e);
            }
        };

        const promise = getPromise();

        if (!promise || !(promise as any).then) {
            throw new Error('请传入Promise')
        }

        setRetry(() => {
            const retryCandidate = runConfig?.retry;
            if (!retryCandidate) {
                return () => {};
            }
            return () => {
                try {
                    const retryPromise = typeof retryCandidate === 'function' ? (retryCandidate as () => Promise<D>)() : (retryCandidate as Promise<D> | undefined);
                    return run(retryPromise as Promise<D>, runConfig);
                } catch (e) {
                    return run(Promise.reject(e) as Promise<D>, runConfig);
                }
            };
        });

        setState(prev => ({ ...prev, stat: 'loading' }))

        return promise
            .then(data => {
                if (mountedRef.current) {
                    setState(() => ({
                        data,
                        error: null,
                        stat: 'success',
                    }));
                }
                return data;
            })
            .catch(error => {
                if (mountedRef.current) {
                    setState(() => ({
                        data: null,
                        error: error instanceof Error ? error : new Error(String(error)),
                        stat: 'error',
                    }));
                }
                if (config.throwOwnError) {
                    return Promise.reject(error);
                }
                return error;
            });
    },[config.throwOwnError,mountedRef])
    
    return{
        isIdle:state.stat==='idle',
        isLoading :state.stat==='loading',
        iserror:state.stat==='error',
        isSuccess:state.stat==='success',
        run,
        setdata: useCallback((data: D) => setState(() => ({ data, error: null, stat: 'success' })), []),
        setError: useCallback((error: Error) => setState(() => ({ data: null, error, stat: 'error' })), []),
        // retry被调用时，重新跑一遍run
        retry,
        ...state

    }
}
