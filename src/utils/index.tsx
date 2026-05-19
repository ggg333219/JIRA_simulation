import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const isFalsy = (value:unknown) => (value === 0 ? false : !value);
export const isVoid=(value:unknown)=>value===undefined||value===null||value===''

export const cleanObject = (object:{[key:string]:unknown}) => {
    const result = { ...object };

    Object.keys(result).forEach((key) => {
        const value = result[key];
        if (isVoid(value)) {
            delete result[key];
        }
    });

    return result;
};

export const useMount = (callback:()=>void) =>{
    useEffect(() =>{
        callback()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
}

export const useDebounce = <V,> (value:V,delay?:number)=>{
    const[debounceValue,setDebounceValue]=useState(value)
    useEffect(()=>{
        const timeout= setTimeout(() => setDebounceValue(value), delay);
        return ()=>clearTimeout(timeout)
    },[value,delay])
    return debounceValue
};

export const useArray=<T,>(values:T[])=>{
    const [value,setValue]=useState(values)
    const add=(item:T)=>{
        setValue([...value,item])
    }
    const removeIndex=(index:number)=>{
        const newList=value.filter((_,i)=>{
            return i!=index;
        })
        setValue(newList)
    }
    const clear=()=>{
        setValue([])
    }
    return { value,setValue, add, removeIndex, clear };
}

export const useDocumentTitle = (title: string, keepOnUnmount: boolean = true) => {
    const oldTitleRef = useRef(document.title);

    useLayoutEffect(() => {
        document.title = title;

        return () => {
            if (!keepOnUnmount) {
                document.title = oldTitleRef.current;
            }
        };
    }, [title, keepOnUnmount]);
};

export const resetRoute=()=>{
    window.location.assign('/projects')
}