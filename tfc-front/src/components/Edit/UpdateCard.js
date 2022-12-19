import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import UserContext from "../../context/UserContext";
import {updateCardUser} from "../../api/api";
import './UpdateCard.css'

const UpdateCard = () => {
    const navigate = useNavigate();
    const [number, setNumber] = useState('')
    const [cvv, setCvv] = useState('')
    const [expiration, setExpiration] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [permissionError, setPermissionError] = useState(false)
    const [updateCardErrors, setUpdateCardErrors] = useState({'number': '', 'cvv': '',
        'expiration': '', 'postal_code': ''})
    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    const handleUpdateCard = async () => {

        const res = await updateCardUser(number, cvv, expiration, postalCode)

        if (res.ok) {
            const currentUser = user
            const data = await res.json();
            currentUser.card = data
            setUser(currentUser)
            navigate('/view')

        }else if (res.status === 400){
            res.text().then(text => {throw new Error(text)})

                .catch(errorData => {
                    const jsonErrorData = JSON.parse(errorData.message)

                    setUpdateCardErrors({...updateCardErrors, number: jsonErrorData['number'],
                        cvv: jsonErrorData['cvv'],
                        expiration: jsonErrorData['expiration'],
                        postal_code: jsonErrorData['postal_code']})
                })
        }else if(res.status === 403){
            setPermissionError(true)
        }
    }

    const handleNumber = (e) => {
        if (e.target.value.length > 16) {
            return;
        }

        setNumber(e.target.value);
    }

    const handleCvv = (e) => {
        if (e.target.value.length > 4) {
            return;
        }
        setCvv(e.target.value);
    }

    return (
        <div>
            <div>

                <div className='update-card-container'>
                    <h1>Update Card</h1>
                    <div className='update-card-instr'>

                        <h3>Instructions:</h3>
                        <h5>Complete the form below to add/update card. Fields marked with a red asterisk (*) are required.</h5>
                    </div>
                    {permissionError && <p className='update-card-error'>Error!<b/> Card already in use by another user</p>}
                    <label htmlFor="username"> <span style={{'color': 'red'}}>*</span> Number</label>
                    <input value={number} onChange={(e) => handleNumber(e)} id="number"/>
                    {updateCardErrors['number'] && updateCardErrors['number'].map((error) =>
                        <div className='update-card-error'>{error}</div>
                    )}


                    <label htmlFor="cvv"><span style={{'color': 'red'}}>*</span> CVV</label>
                    <input value={cvv} onChange={(e) => handleCvv(e)} id="cvv"/><br/>
                    {updateCardErrors['cvv'] && updateCardErrors['cvv'].map((error) =>
                        <div className='update-card-error'>{error}</div>
                    )}


                    <label htmlFor="expiration"><span style={{'color': 'red'}}>*</span> Expiration date</label>
                    <input placeholder='YYYY-MM'
                           onChange={(event) => setExpiration(event.target.value)} id="expiration"/><br/>
                    <div className='update-card-error'>{updateCardErrors['expiration']}</div>

                    <label htmlFor="postal_code"><span style={{'color': 'red'}}>*</span> Postal code</label>
                    <input placeholder='A1A 1A1 or A1A1A1'
                           onChange={(event) => setPostalCode(event.target.value)} id="postal_code"/><br/>
                    <div className='update-card-error'>{updateCardErrors['postal_code']}</div>


                    <button onClick={handleUpdateCard}>Update Card</button>
                    <button className='prev-btn' onClick={() => navigate('/view')}>Back</button>

                </div>

            </div>

        </div>
    )
}
export default UpdateCard