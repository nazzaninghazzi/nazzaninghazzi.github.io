import image from '../../assets/tfc.png'
import './Signin.css'
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import * as PropTypes from "prop-types";
import {signInUser, getInfoUser} from "../../api/api";
import UserContext from "../../context/UserContext";
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

function CloseIcon(props) {
    return null;
}

CloseIcon.propTypes = {fontSize: PropTypes.string};
const Signin = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [open, setOpen] = useState(false)
    const {setUser} = useContext(UserContext)
    const navigate = useNavigate();

    const handleSignIn = async () => {
        const res = await signInUser(username, password)

        if (res.status === 200) {
            const tokenData = await res.json();
            localStorage.setItem('userToken', tokenData['access'])
            const res2 = await getInfoUser()
            const data = await res2.json();
            setUser(data)
            navigate('/account')

        }else{
            setOpen(true)
        }
    }


    return (

        <div className = 'background_image' style={{backgroundImage:`url(${image})`}}>
            <div className='login-container'>
                <h1>Login</h1>
                <h4 className='login-query1'><AccountCircleRoundedIcon className='view-logo'/>Username</h4>
                <input value={username} onChange={(event) => setUsername(event.target.value)} className='login-input1'/>
                <h4 className='login-query2'><VpnKeyRoundedIcon className='view-logo'/>Password</h4>
                <input type='password' value={password} onChange={(event) => setPassword(event.target.value)} className='login-input2'/>
                <button onClick={() => handleSignIn()}>Sign In</button>
                {open &&
                    <div className='signin-error'>
                        Username or password is wrong!
                    </div>
                    }
                <h5>No account?</h5>
                <Link className='signup-link' to="/SignUp">Signup</Link>

            </div>
            <Outlet />
        </div>

    )
}

export default Signin