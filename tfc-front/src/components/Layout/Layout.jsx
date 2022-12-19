import { Link, Outlet, useNavigate } from "react-router-dom";
import './Layout.css'
import Button from '@mui/material/Button';
import { useContext, useState, useEffect } from "react";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import UserContext from "../../context/UserContext";
import ClassContext from "../../context/ClassContext";
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from "@mui/material/Avatar";
import { authenticateUser, getClassSchedule } from "../../api/api";

const Layout = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext)

    const { classes, setClasses } = useContext(ClassContext)
    useEffect(() => {

        const getClassScheduleAsync = async () => {
            const res = await getClassSchedule()

            if (res.ok) {

                const response = await res.json();
                console.log(response)
                return response
            }
        }
        getClassScheduleAsync().then(json => {
            setClasses(json)
        })
    }, [])

    useEffect(() => {
        authenticateUser().then((isAuthed) => {
            if (!isAuthed) {
                navigate('/signIn');
            }
            else {
                setUser(isAuthed);
                console.log(isAuthed);
            }
        });
    }, []);



    const [menuButton, setMenuButton] = useState(false);


    const changeButton = () => {
        setMenuButton(!menuButton);
    }
    const handleView = () => {
        setMenuButton(!menuButton);
        navigate('/view')
    }
    const handleSignOut = () => {
        localStorage.removeItem('userToken');
        navigate('/signIn')
        window.location.reload();
    }
    const handleAvatar = () => {
        setMenuButton(!menuButton);
        navigate(`/edit/${user?.username}`)
    }

    return (
        <>
            <nav className="nav">
                <h1 className="navbar-logo"><Link to="/">TFC</Link></h1>
                <div className="menu-icon" onClick={changeButton}>
                    <Button variant="outlined" onClick={changeButton}>
                        Menu
                    </Button>
                </div>
                <ul className={menuButton ? 'nav-menu active' : 'nav-menu'}>
                    <li>
                        <Button variant="outlined" onClick={handleView}>
                            <AccountCircleRoundedIcon />
                            <Link className="navbar-button" to="/account">Account</Link>
                        </Button>

                    </li>
                    <li>
                        <Button variant="outlined" onClick={changeButton}>
                            <LoyaltyRoundedIcon />
                            <Link className="navbar-button" to="/plans">Plans</Link>
                        </Button>
                    </li>
                    <li>
                        <Button variant="outlined" onClick={changeButton}>
                            <SearchRoundedIcon />
                            <Link className="navbar-button" to="/search">Search</Link>
                        </Button>
                    </li>

                    <li>
                        <Button variant="outlined" onClick={handleSignOut}>
                            <LogoutIcon />
                            <Link className="navbar-button" to="/search">Log out</Link>
                        </Button>
                    </li>
                    <li>
                        <Avatar
                            onClick={handleAvatar} className='avatar' alt="avatar" src={user?.avatar} sx={{ width: 56, height: 56 }} />
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default Layout;