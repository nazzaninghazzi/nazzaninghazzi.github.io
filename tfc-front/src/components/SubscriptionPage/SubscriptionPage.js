import './SubscriptionPage.css';
import {useContext, useEffect, useState} from "react";
import UserContext from "../../context/UserContext";
import {getSubscriptions, subscribeUser, unsubscribeUser, authenticateUser} from "../../api/api";
import {useNavigate} from "react-router-dom";

export default function SubscriptionPage() {
    
    const {user, setUser} = useContext(UserContext)
    const perPage = 5;
    const [detail, setDetail] = useState({plans: [], isNext: '', isPrev: '', buttonTexts: {}})
    const [page, setPage] = useState(1)
    const [currentPlan, setCurrentPlan] = useState(user?.subscription === null ? 'None' :
        user?.subscription.price + '$ per ' +
        user?.subscription.interval)
    const [cardAlert, setCardAlert] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        authenticateUser().then((isAuthed) => {
            if (!isAuthed) {
                navigate('/signIn');
            }
            else {
                setUser(isAuthed);
                console.log(isAuthed);
                setCurrentPlan(isAuthed.subscription === null ? 'None' :
                isAuthed.subscription.price + '$ per ' +
                isAuthed.subscription.interval)
            }
        });
    }, []);


    useEffect( () => {
        let copyButtonTexts = {}
        const getSubscriptionsAsync = async () => {
            const res = await getSubscriptions(page)

            if (res.status === 200) {
                const response = await res.json();
                return response
            }
        }
        getSubscriptionsAsync().then(json =>
        {
            json.results.forEach(item => user?.subscription !== null && user?.subscription.id === item.id?
                copyButtonTexts[item.id] = 'Unsubscribe': copyButtonTexts[item.id] = 'Subscribe')

            setDetail({plans: json.results,
                isPrev: json.previous,
                isNext: json.next,
                buttonTexts: copyButtonTexts})})

    }, [page, user])

    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    const handleSubscription  = async (plan) => {
        const currentUser = user

        if (user.subscription === null || user.subscription.id !== plan.id) {
            setCardAlert(false)
            const res = await subscribeUser(plan.id)
            if (res.status === 200){
                const response = await res.json()
                setCurrentPlan(response.subscription.price + '$ per ' +
                    response.subscription.interval)
                let copyButtonTexts = detail.buttonTexts
                copyButtonTexts[plan.id] = 'Unsubscribe'
                if (user.subscription !== null) {
                    copyButtonTexts[user.subscription.id] = 'Subscribe'
                }
                setDetail({...detail, buttonTexts: copyButtonTexts})

                currentUser.subscription = plan
                setUser(currentUser)
            }else if(res.status === 403){
                setCardAlert(true)
            }

        } else {
            const res = await unsubscribeUser()
            if (res.status === 200){
                const currentUser = user
                setCurrentPlan('None')
                currentUser.subscription = null
                let copyButtonTexts = detail.buttonTexts
                copyButtonTexts[plan.id] = 'Subscribe'
                setDetail({...detail, buttonTexts: copyButtonTexts})
                setUser(currentUser)
            }
        }
    }


    return (
        <div className="subscription-page">
            <p>Our plans are are available per week, month, or year.</p>
            <p>Below is a list of all current subscription plans.</p>
            <p>Your current plan is: {currentPlan}</p>
            {cardAlert && <p className='card-error'>ERROR! <br/> Please add a card before subscription</p>}
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Price</th>
                    <th>Interval</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

                {detail.plans.map((plan, index) => (
                    <tr key={plan.id}>
                        <td>{ (page - 1) * perPage + index + 1 }</td>
                        <td>{plan.price}</td>
                        <td>{plan.interval}</td>
                        <td><button className='subscribe-btn' onClick={() => handleSubscription(plan)}
                        >{detail.buttonTexts[plan.id]}</button></td>
                    </tr>
                    )
                )}
                </tbody>

            </table>
            <div className='btn-container'>
                {detail.isPrev ? <button className='prev-btn' onClick={() => setPage(page - 1)
                }>Prev</button> : null}
                {detail.isNext ? <button className='next-btn' onClick={() => setPage(page + 1)
                }>Next</button> : null}
            </div>


        </div>
    )
}
