import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getClassHistory} from "../../api/api";
import './ClassHistory.css'

const ClassHistory = () => {

    const perPage = 5;
    const [detail, setDetail] = useState({copyClasses: [], isNext: '', isPrev: ''})
    const [page, setPage] = useState(1)
    const navigate = useNavigate();

    useEffect( () => {

        const getClassHistoryAsync = async () => {
            const res = await getClassHistory(page)

            if (res.ok) {
                const response = await res.json();
                return response
            }
        }
        getClassHistoryAsync().then(json =>
        {
            setDetail({...detail,
                copyClasses: json.results,
                isPrev: json.previous,
                isNext: json.next})

        })}, [page])

    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    return (
        <div className='class-history-page'>
            <h1>Class History</h1>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Class Name</th>
                    <th>Studio Name</th>
                    <th>Date</th>
                    <th>Time</th>

                </tr>
                </thead>
                <tbody>

                {detail.copyClasses.map((copyClass, index) => (
                        <tr key={index}>
                            <td>{ (page - 1) * perPage + index + 1 }</td>
                            <td>{copyClass.class_name}</td>
                            <td>{copyClass.studio_name}</td>
                            <td>{copyClass.date}</td>
                            <td>{copyClass.time}</td>
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
export default ClassHistory