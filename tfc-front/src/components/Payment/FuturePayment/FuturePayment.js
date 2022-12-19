import {useEffect, useState} from "react";
import {getFuturePayments} from "../../../api/api";
import './FuturePayment.css'
import {useNavigate} from "react-router-dom";
const FuturePayment = () => {

    const navigate = useNavigate();
    const perPage = 5;
    const [detail, setDetail] = useState({payments: [], isNext: true, isPrev: false})
    const [page, setPage] = useState(1)

    useEffect( () => {

        const getFuturePaymentsAsync = async () => {
            const res = await getFuturePayments(page)
            console.log(res)
            if (res.status === 200) {
                const response = await res.json();

                return response
            }
        }
        getFuturePaymentsAsync().then(json =>
        {
            setDetail({payments: json.results,
                isPrev: json.previous,
                isNext: json.next})})

    }, [page])
    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    return (
        <div className="future-payment-page">
            <p>Below is a list of all expected future payments based on your current plan and card status.</p>

            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Card Number</th>
                    <th>Payment Price</th>
                    <th>Payment Date</th>
                </tr>
                </thead>
                <tbody>

                {detail.payments.map((payment, index) => (
                        <tr key={index}>
                            <td>{ (page - 1) * perPage + index + 1 }</td>
                            <td>{payment.card.number}</td>
                            <td>{payment.payment_price}$</td>
                            <td>{payment.payment_date}</td>
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
            <button className='prev-btn' onClick={() => navigate('/view')}>Back</button>
        </div>
    )


}
export default FuturePayment