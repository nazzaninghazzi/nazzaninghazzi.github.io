import { useState, createContext } from 'react';

export const useClassContext = () => {
    const [classes, setClasses] = useState([]);

    return {
        classes,
        setClasses,
    }
}

const ClassContext = createContext({
    classes: [], setClasses: () => { }
});

export default ClassContext;