import './AccountPage.css'
import logo from '../../assets/tfc.png'
import { useContext, useEffect } from "react";
import UserContext from '../../context/UserContext';

export default function AccountPage() {

    const {user} = useContext(UserContext)

    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    return (
        <div className="account-page">
            <h1>Welcome to TFC {user?.username}!</h1>
            <img src={logo} alt='TFC logo'/>
            <p className='description'>Toronto Fitness Club (TFC) is the new rival for GoodLife Fitness and LA Fitness in Toronto.
                The Canada-based business owners founded a new chain fitness club in Toronto aiming to expand their business to
                other major cities in North America.</p>

        </div>
    )
}