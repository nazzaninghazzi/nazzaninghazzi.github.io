import './ClassSearchItem.css';

import { useState, useContext, useEffect } from "react";
import Button from '@mui/material/Button';
import { enrollInClass } from '../../../api/api.js';
import ClassContext from '../../../context/ClassContext.js';

export default function ClassSearchItem(props) {

    const {classes, setClasses} = useContext(ClassContext)
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

    useEffect(() => {
        // check if user is already enrolled in this class
        // if so, setAlreadyEnrolled to true
        classes.forEach((classItem) => {
            if (classItem.class_instance_id === props.classItem.class_instance_id) {
                setAlreadyEnrolled(true);
            }
        });
    }, []);


    const handleEnroll = async (enrollAll) => {
        let res = await enrollInClass(props.classItem.id, !enrollAll ? props.classItem.date : null);
        if (res.status === 200) {
            setAlreadyEnrolled(true);
        } else if (res.status === 403) {
            res.json().then((data) => {
                alert(data.detail);
            });
        }
    }

    return (
        <div className="studio-page-class-item">
            <h3 className='no-margin-padding lignt-color'>{props.classItem.class_name}</h3>
            <p className='no-margin-padding lignt-color'><b>Description:</b> {props.classItem.description}</p>
            <p className='no-margin-padding lignt-color'><b>Date:</b> {new Date(props.classItem.date.replace('-', '/')).toDateString()} {new Date(props.classItem.start_time).toLocaleTimeString()} - {new Date(props.classItem.end_time).toLocaleTimeString()}</p>
            <p className='no-margin-padding lignt-color'><b>Coach:</b> {props.classItem.coach}</p>
            <p className='no-margin-padding lignt-color'><b>Space Left:</b> {props.classItem.free_spots}</p>
            <Button
                disabled={alreadyEnrolled}
                style={{ 'marginTop': '10px', 'marginRight': '10px' }}
                variant="outlined"
                onClick={handleEnroll}
                className={alreadyEnrolled ? '' : 'class-search-outlined'}>
                {alreadyEnrolled ? 'Enrolled' : 'Enroll'}
            </Button>
            {!alreadyEnrolled && <Button
                disabled={alreadyEnrolled}
                style={{ 'marginTop': '10px' }}
                variant="contained"
                onClick={handleEnroll}
                className={alreadyEnrolled ? '' : 'class-search-contained'}>
                Enroll all Future Classes
            </Button>}
        </div>
    );
}
