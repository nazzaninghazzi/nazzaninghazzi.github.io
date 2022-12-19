import './IntroLayout.css'
import { Outlet } from "react-router-dom";

const IntroLayout = () => {
    return (
        <>
            <nav className='intro-bar'>
                <h1>Welcome!</h1>
            </nav>
            <Outlet />
        </>
    )
}
export default IntroLayout