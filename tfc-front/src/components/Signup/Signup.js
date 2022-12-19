import './Signup.css'
import {Link, useNavigate} from "react-router-dom";
import {signInUser, signUpUser} from "../../api/api";
import {useContext, useEffect, useState} from "react";
import UserContext from "../../context/UserContext";

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [passwords, setPasswords] = useState({'password': '', 'password2': ''})
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [avatar, setAvatar] = useState('')
    const [signUpErrors, setSignUpErrors] = useState({'username': '', 'password': '',
    'password2': '', 'first_name': '', 'last_name': '', 'email': '', 'phone_number': '' })
    const {setUser} = useContext(UserContext)

    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    const handleSignUp = async () => {

        const res = await signUpUser(username, passwords['password'], passwords['password2'],
            firstName, lastName, email, phoneNumber, avatar)

        if (res.ok) {
            const data = await res.json();
            setUser(data)
            const res2 = await signInUser(data['username'], passwords['password'])
            if (res2.ok){
                const data2 = await res2.json()
                localStorage.setItem('userToken', data2['access'])
                navigate('/account')
            }

        }else{
            setPasswords({...passwords, password: '', password2: ''})

            res.text().then(text => {throw new Error(text)})

            .catch(errorData => {
                const jsonErrorData = JSON.parse(errorData.message)

                setSignUpErrors({...signUpErrors, username: jsonErrorData['username'],
                    password: jsonErrorData['password'],
                    password2: jsonErrorData['repeat_password'],
                    first_name: jsonErrorData['first_name'],
                    last_name: jsonErrorData['last_name'],
                    email: jsonErrorData['email'],
                    phone_number: jsonErrorData['phone_number']})
            })

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

                <div className='signup-container'>
                    <h1>Sign Up</h1>
                    <div className='signup-instr'>

                        <h3>Instructions:</h3>
                        <h5>Complete the form below to register. Fields marked with a red asterisk (*) are required.</h5>
                    </div>

                    <label htmlFor="username"> <span style={{'color': 'red'}}>*</span> Username</label>
                    <input onChange={(event) => setUsername(event.target.value)} id="username"/>
                    <div className='signup-error'>{signUpErrors['username']}</div>

                    <label htmlFor="password"><span style={{'color': 'red'}}>*</span> Password</label>
                    <input value={passwords.password}
                           onChange={(event) => setPasswords({...passwords, password: event.target.value})}
                           type="password" id="password"/><br/>
                    <div className='signup-error'>{signUpErrors['password']}</div>

                    <label htmlFor="password2"><span style={{'color': 'red'}}>*</span> Repeat password</label>
                    <input value={passwords.password2}
                           onChange={(event) => setPasswords({...passwords, password2: event.target.value})}
                           type="password" id="password2"/><br/>
                    <div className='signup-error'>{signUpErrors['password2']}</div>

                    <label htmlFor="first_name"><span style={{'color': 'red'}}>*</span> First name</label>
                    <input onChange={(event) => setFirstName(event.target.value)} id="first_name"/><br/>
                    <div className='signup-error'>{signUpErrors['first_name']}</div>

                    <label htmlFor="last_name"><span style={{'color': 'red'}}>*</span> Last name</label>
                    <input onChange={(event) => setLastName(event.target.value)} id="last_name"/><br/>
                    <div className='signup-error'>{signUpErrors['last_name']}</div>

                    <label htmlFor="email"><span style={{'color': 'red'}}>*</span> Email</label>
                    <input onChange={(event) => setEmail(event.target.value)} type="email" id="email"/><br/>
                    <div className='signup-error'>{signUpErrors['email']}</div>

                    <label htmlFor="number"> <span style={{'color': 'red'}}>*</span> Phone Number</label>
                    <input value={phoneNumber} onChange={(event) => handlePhoneNumber(event)} id="number"/><br/>
                    <div className='signup-error'>{signUpErrors['phone_number']}</div>

                    <label htmlFor="avatar">Avatar</label>
                    <input onChange={(event) => setAvatar(event.target.files[0])} type="file" id="avatar"/>

                    <button onClick={() => handleSignUp()}>Create Account!</button>
                    <h4>Have an account?</h4>
                    <Link className='signin-link' to="/SignIn">Sign in</Link>

                </div>



            </div>

        </div>
    )
}

export default Signup
// import axios from 'axios';
//
// import React,{Component} from 'react';
//
// class Signup extends Component {
//
//     state = {
//
//         // Initially, no file is selected
//         selectedFile: null
//     };
//
//     // On file select (from the pop up)
//     onFileChange = event => {
//
//         // Update the state
//         this.setState({ selectedFile: event.target.files[0] });
//
//     };
//
//     // On file upload (click the upload button)
//     onFileUpload = () => {
//
//         // Create an object of formData
//         const formData = new FormData();
//
//         // Update the formData object
//         formData.append(
//             "myFile",
//             this.state.selectedFile,
//             this.state.selectedFile.name
//         );
//
//         // Details of the uploaded file
//         console.log(this.state.selectedFile);
//
//         // Request made to the backend api
//         // Send formData object
//         axios.post("api/uploadfile", formData);
//     };
//
//     // File content to be displayed after
//     // file upload is complete
//     fileData = () => {
//
//         if (this.state.selectedFile) {
//
//             return (
//                 <div>
//                     <h2>File Details:</h2>
//                     <p>File Name: {this.state.selectedFile.name}</p>
//
//                     <p>File Type: {this.state.selectedFile.type}</p>
//
//                     <p>
//                         Last Modified:{" "}
//                         {this.state.selectedFile.lastModifiedDate.toDateString()}
//                     </p>
//
//                 </div>
//             );
//         } else {
//             return (
//                 <div>
//                     <br />
//                     <h4>Choose before Pressing the Upload button</h4>
//                 </div>
//             );
//         }
//     };
//
//     render() {
//
//         return (
//             <div>
//                 <h1>
//                     GeeksforGeeks
//                 </h1>
//                 <h3>
//                     File Upload using React!
//                 </h3>
//                 <div>
//                     <input type="file" onChange={this.onFileChange} />
//                     <button onClick={this.onFileUpload}>
//                         Upload!
//                     </button>
//                 </div>
//                 {this.fileData()}
//             </div>
//         );
//     }
// }
//
// export default Signup;
//
