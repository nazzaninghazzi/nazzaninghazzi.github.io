import { useState, createContext } from 'react';

export const useUserContext = () => {
    const [user, setUser] = useState(null);

    return {
        user,
        setUser,
    }
}

const UserContext = createContext({
    user: null, setUser: () => { }
    });

export default UserContext;