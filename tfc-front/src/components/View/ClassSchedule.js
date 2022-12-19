import {useContext, useEffect, useState} from "react";
import ClassContext from "../../context/ClassContext";
import {useNavigate} from "react-router-dom";
import {getClassSchedule} from "../../api/api";
import './ClassHistory.css'
import {dropOneClass, dropAllClasses} from "../../api/api";
import Button from "@mui/material/Button";

const ClassSchedule = () => {
    const {classes, setClasses} = useContext(ClassContext)

    const [allClasses, setAllClasses] = useState({})
    const navigate = useNavigate();

    useEffect( () => {

        const getClassScheduleAsync = async () => {
            const res = await getClassSchedule()

            if (res.ok) {

                const response = await res.json();
                console.log(response)
                return response
            }
        }
        getClassScheduleAsync().then(json =>{
                setAllClasses(divideClasses(json))
        })}, [classes])


    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);

    const divideClasses = (all) => {
        let dividedClasses = {}

        all.forEach(item => {
            item.class_name in dividedClasses ?
                dividedClasses[item.class_name].push(item) : dividedClasses[item.class_name] = [item]

        })
        return dividedClasses
    }

    const handleDropOne = async (class_name, class_instance_id, date) => {
        let copyAllClasses = allClasses
        copyAllClasses[class_name].filter(item => item.class_instance_id !== class_instance_id)
        await dropOneClass(class_instance_id, date).then(() => setClasses(copyAllClasses))

    }

    const handleDropAll = async (className, class_instance_id) => {
        let copyAllClasses = allClasses
        delete copyAllClasses[className]
        await dropAllClasses(class_instance_id).then(() => setClasses(copyAllClasses))

    }

    return (
        <div className='class-history-page'>
            <h1>Class Schedule</h1>
            {Object.keys(allClasses).map((className, index) => (
                <div key={index}>
                    <div className='schedule-container'>
                        <h3>{className}</h3>
                        <Button onClick={() => handleDropAll(className, allClasses[className][0].class_instance_id)}
                                variant="contained"
                                sx={{ backgroundColor: 'orange',
                                    ':hover': {
                                        bgcolor: 'white',
                                        color: 'orange',
                                    }}}
                        style={{'marginLeft': '8%', 'height':'8vh'}}>
                            Drop all Future Classes
                        </Button>

                    </div>

                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Studio Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Alert</th>
                            <th></th>

                        </tr>
                        </thead>
                        <tbody>

                        {allClasses[className].map((copyClass, index) => (
                                <tr key={index}>
                                    <td>{index + 1 }</td>
                                    <td>{copyClass.studio_name}</td>
                                    <td>{copyClass.date}</td>
                                    <td>{copyClass.time}</td>
                                    <td>{copyClass.alert}</td>
                                    <td>
                                        <Button variant="outlined"
                                                onClick={() => handleDropOne(className, copyClass.class_instance_id, copyClass.date)}
                                                sx={{ color: 'orange', borderColor:'orange',
                                                    ':hover': {
                                                        bgcolor: 'orange',
                                                        color: 'white',
                                                    },}}
                                        >
                                            Drop
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>

                    </table>

                </div>


            ))}


            <button className='prev-btn' onClick={() => navigate('/view')}>Back</button>
        </div>
    )
}
export default ClassSchedule