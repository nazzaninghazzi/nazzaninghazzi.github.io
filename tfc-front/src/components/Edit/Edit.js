import {useNavigate} from "react-router-dom";
import {useContext, useState, useEffect} from "react";
import UserContext from "../../context/UserContext";
import Avatar from '@mui/material/Avatar';
import {editUser} from "../../api/api";
import './Edit.css'

const Edit = () => {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext)
    
    useEffect(() => {
        if (user) {
            setUsername(user.username)
            setFirstName(user.first_name)
            setLastName(user.last_name)
            setEmail(user.email)
            setPhoneNumber(user.phone_number)
            setAvatar(user.avatar)
        }
    }, [user]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [username, setUsername] = useState(user?.username)
    const [passwords, setPasswords] = useState({'password': '', 'password2': ''})
    const [firstName, setFirstName] = useState(user?.first_name)
    const [lastName, setLastName] = useState(user?.last_name)
    const [email, setEmail] = useState(user?.email)
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number)
    const [avatar, setAvatar] = useState(user?.avatar === null ? '' : user?.avatar)
    const [initialAvatar, setInitialAvatar] = useState(avatar)
    const [avatarPop, setAvatarPop] = useState(false)

    const [editErrors, setEditErrors] = useState({'username': '', 'password': '',
        'password2': '', 'first_name': '', 'last_name': '', 'email': '', 'phone_number': '' })

    const [editError2, setEditError2] = useState('')

    const handleEdit = async () => {

        const res = await editUser(username, passwords['password'], passwords['password2'],
            firstName, lastName, email, phoneNumber, avatar)

        if (res.ok) {
            const data = await res.json();
            setUser(data)
            navigate('/view')

        }else if(res.status === 400){
            setPasswords({...passwords, password: '', password2: ''})

            res.text().then(text => {throw new Error(text)})

                .catch(errorData => {
                    console.log(errorData)
                    const jsonErrorData = JSON.parse(errorData.message)

                    setEditErrors({...editErrors, username: jsonErrorData['username'],
                        password: jsonErrorData['password'],
                        password2: jsonErrorData['repeat_password'],
                        first_name: jsonErrorData['first_name'],
                        last_name: jsonErrorData['last_name'],
                        email: jsonErrorData['email'],
                        phone_number: jsonErrorData['phone_number']})
                })
        }else if(res.status === 404){
            setEditError2('Username not found')
        }else if (res.status === 403){
            setEditError2('You do not have permission to perform this action')
        }
    }

    const handlePhoneNumber = (e) => {
        if (e.target.value.length > 10) {
            return;
        }
        setPhoneNumber(e.target.value);
    }

    return (
        <div>
            <div>

                <div className='edit-container'>
                    <h1>Edit</h1>
                    <div className='edit-instr'>

                        <h3>Instructions:</h3>
                        <h5>- Username can not be changed. <br/> - Password and repeat password are required</h5>
                    </div>

                    <div className='edit-error'>{editError2}</div>

                    <Avatar className='avatar' alt="avatar" src={initialAvatar} sx={{ width: 56, height: 56 }}/>
                    <div className='avatar-container'>
                        <h4 onClick={() => {
                            setAvatar('')
                            setInitialAvatar('')
                        }}>Remove</h4>

                        <h4 onClick={() => setAvatarPop(true)}>Edit</h4>
                    </div>
                    {avatarPop && <input onChange={(event) => {setAvatar(
                        event.target.files[0])
                        setInitialAvatar(avatar.name)
                    }} type="file" id="avatar"/>}

                    <label htmlFor="username">Username</label>
                    <input value={username} id="username" readOnly/>
                    <div className='edit-error'>{editErrors['username']}</div>

                    <label htmlFor="password">Password</label>
                    <input value={passwords.password}
                           onChange={(event) => setPasswords({...passwords, password: event.target.value})}
                           type="password" id="password"/><br/>
                    <div className='edit-error'>{editErrors['password']}</div>

                    <label htmlFor="password2">Repeat password</label>
                    <input value={passwords.password2}
                           onChange={(event) => setPasswords({...passwords, password2: event.target.value})}
                           type="password" id="password2"/><br/>
                    <div className='edit-error'>{editErrors['password2']}</div>

                    <label htmlFor="first_name">First name</label>
                    <input value={firstName} onChange={(event) => setFirstName(event.target.value)} id="first_name"/><br/>
                    <div className='edit-error'>{editErrors['first_name']}</div>

                    <label htmlFor="last_name">Last name</label>
                    <input value={lastName} onChange={(event) => setLastName(event.target.value)} id="last_name"/><br/>
                    <div className='edit-error'>{editErrors['last_name']}</div>

                    <label htmlFor="email">Email</label>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" id="email"/><br/>
                    <div className='edit-error'>{editErrors['email']}</div>

                    <label htmlFor="number"> Phone Number</label>
                    <input value={phoneNumber} onChange={(event) => handlePhoneNumber(event)} id="number"/><br/>
                    <div className='edit-error'>{editErrors['phone_number']}</div>


                    <button onClick={() => handleEdit()}>Edit</button>
                    <button onClick={() => navigate('/updateCard')}>Update Card</button>
                    <button className='prev-btn' onClick={() => navigate('/view')}>Back</button>

                </div>



            </div>

        </div>
    )
}
export default Edit