import { useState, useEffect } from 'react';
function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timeOutHandle = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(timeOutHandle);
        };
    }, [value, delay]);
    return debounceValue;
}

export default useDebounce;
