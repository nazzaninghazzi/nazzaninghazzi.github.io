import {useContext, useEffect} from "react";
import UserContext from "../../context/UserContext";
import {Link, useNavigate} from "react-router-dom";
import Divider from '@mui/material/Divider';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import SportsMartialArtsRoundedIcon from '@mui/icons-material/SportsMartialArtsRounded';
import AbcIcon from '@mui/icons-material/Abc';
import FaceIcon from '@mui/icons-material/Face';
import Avatar from '@mui/material/Avatar';
import './View.css'

const View = () => {

    const navigate = useNavigate();

    const {user} = useContext(UserContext)

    const userPlan = user?.subscription === null ? 'No plans yet! Go to Plans tab to subscribe' :
        'Plan #' + user?.subscription.id + ':       ' + user?.subscription.price + '$ per '+ user?.subscription.interval

    const userCard1 = user?.card === null ? 'No cards yet!' :
        'Number: ' + user?.card.number

    const userCard2 = user?.card === null ? 'Click on add card Button' :
        'Expiration date: ' + user?.card.expiration

    const userCard3 = user?.card === null ? 'To add a card and be able to subscribe' :
        'Postal code: '+ user?.card.postal_code

    const handlePaymentHistory = () => {
        navigate('/paymentHistory')
    }
    const handleFuturePayment = () => {
        navigate('/futurePayment')
    }

    const handleUpdateCard = () => {
        navigate('/updateCard')
    }
    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    return (
        <div className={'view-container'}>
            <h1>Profile</h1>
            <Link className='edit-link' to={`/edit/${user?.username}`}>Edit Profile</Link><br/>

            <p><Person2RoundedIcon className='view-logo'/>Username <span className='value'>{user?.username}</span></p>
            <Divider variant="middle" />
            <p><HttpsRoundedIcon className='view-logo'/>Password <span className='value'>*******</span></p>
            <Divider variant="middle" />
            <p><EmailRoundedIcon className='view-logo'/>Email <span className='value'>{user?.email}</span></p>
            <Divider variant="middle" />
            <p><AbcIcon className='view-logo'/>First Name <span className='value'>{user?.first_name}</span></p>
            <Divider variant="middle" />
            <p><AbcIcon className='view-logo'/>Last Name <span className='value'>{user?.last_name}</span></p>
            <Divider variant="middle" />
            <p><LocalPhoneRoundedIcon className='view-logo'/> Phone Number <span className='value'>{user?.phone_number}</span></p>
            <Divider variant="middle" />
            <div className="like-a-p"><FaceIcon className='view-logo'/> Avatar
                <Avatar className='avatar' alt="avatar" src={user?.avatar} sx={{ width: 56, height: 56 }}/></div>

            <Divider variant="middle" />
            <p><LoyaltyRoundedIcon className='view-logo'/>Subscription Plan <span className='value'>{userPlan}</span></p>
            <Divider variant="middle" />
            <p><CreditCardRoundedIcon className='view-logo'/>Card <span className='value'>{userCard1}</span></p>
            <p><span className='value'>{userCard2}</span></p>
            <p><span className='value'>{userCard3}</span></p>
            {user?.card === null && <button onClick={handleUpdateCard} className='add-card-btn'>Add Card</button>}
            <Divider variant="middle" />
            <p className='direct' onClick={() => navigate('/classHistory')}>
                <SportsGymnasticsIcon className='view-logo'/> Click to class history</p>
            <br/><br/>
            <Divider variant="middle" />
            <p className='direct' onClick={() => navigate('/classSchedule')}>
                <SportsMartialArtsRoundedIcon className='view-logo'/> Click to see/drop scheduled classes
            </p><br/><br/>
            <Divider variant="middle" />
            <h2>Click on either of these buttons to see payment history/future.</h2>
            <div className='payment-container'>
                <button onClick={handlePaymentHistory} className='payment-btn'>Payment history</button>
                <button onClick={handleFuturePayment} className='payment-btn'>Future payments</button>
            </div>


        </div>
    )

}
export default View