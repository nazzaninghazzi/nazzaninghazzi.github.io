import './StudioPage.css';
import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    getStudioDetails,
    getStudioClasses,
    paginationSearch,
    searchStudioClasses
} from '../../api/api';
import { useNavigate } from "react-router-dom";
import ImageCarousel from './ImageCarousel/ImageCarousel';
import Button from '@mui/material/Button';
import ClassItem from './ClassItem/ClassItem';
import ClassSearchItem from './ClassSearchItem/ClassSearchItem';
import { WithContext as ReactTags } from 'react-tag-input';
import UserContext from '../../context/UserContext';


export default function StudioPage(props) {
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext)

    const [searchParams, setSearchParams] = useSearchParams();
    const [studioDetails, setStudioDetails] = useState({});
    const [classSearch, setClassSearch] = useState(false);
    const [allClasses, setAllClasses] = useState([]);
    const [searchedClasses, setSearchedClasses] = useState([]);
    const [allClassPrev, setAllClassPrev] = useState("");
    const [searchedClassesPrev, setSearchedClassesPrev] = useState("");
    const [allClassNext, setAllClassNext] = useState("");
    const [searchedClassesNext, setSearchedClassesNext] = useState("");


    const [coachNames, setCoachNames] = useState([]);
    const [classNames, setClassNames] = useState([]);
    const [date, setDate] = useState("");
    const [starttime, setStarttime] = useState("");
    const [endtime, setEndtime] = useState("");


    // 13 is the enter key, 188 is the comma key
    const delimiters = [13, 188];

    // gets the studio details
    useEffect(() => {
        window.scrollTo(0, 0);
        let studio_id = searchParams.get("studio_id");
        getStudioDetails(studio_id).then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setStudioDetails(data);
                });
            } else {
                navigate("/");
            }
        });
    }, []);

    // gets all the classes
    useEffect(() => {
        if (!classSearch) {
            let studio_id = searchParams.get("studio_id");
            getStudioClasses(studio_id).then((response) => {
                console.log(response.status);
                if (response.status === 200) {
                    response.json().then((data) => {
                        setAllClasses(data.results);
                        setAllClassPrev(data.previous ? data.previous : "");
                        setAllClassNext(data.next ? data.next : "");
                        console.log(data);
                    });
                }
            });
        }

    }, [classSearch]);

    const handleAllNextPrev = (url) => {
        console.log(url);
        if (!classSearch) {
            paginationSearch(url).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setAllClasses(data.results);
                        setAllClassPrev(data.previous ? data.previous : "");
                        setAllClassNext(data.next ? data.next : "");
                        console.log(data);
                    });
                }
            });
        }
    }

    const handleSearchedNextPrev = (url) => {
        console.log(url);
        if (classSearch) {
            paginationSearch(url).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setSearchedClasses(data.results);
                        setSearchedClassesPrev(data.previous ? data.previous : "");
                        setSearchedClassesNext(data.next ? data.next : "");
                        console.log(data);
                    });
                }
            });
        }
    }

    const handleSearchButton = async () => {
        const coachNamesString = coachNames.map((item) => item.text).join(',');
        const classNamesString = classNames.map((item) => item.text).join(',');
        let studio_id = searchParams.get("studio_id");
        let time_range = '';
        if (starttime !== "" && endtime !== "") {
            time_range = starttime + ":00," + endtime + ":00";
        }

        const res = await searchStudioClasses(studio_id, classNamesString, coachNamesString, date, time_range);
        if (res.status === 200) {
            res.json().then((data) => {
                setSearchedClasses(data.results);
                setSearchedClassesPrev(data.previous ? data.previous : "");
                setSearchedClassesNext(data.next ? data.next : "");
                console.log(data);
            });
        }
    }

    return (
        <div className="studio-page">
            {Object.keys(studioDetails).length !== 0 && <>
                <h1>{studioDetails.name}</h1>
                <div style={{ padding: '20px' }}>
                    <ImageCarousel images={studioDetails.images} ></ImageCarousel>
                </div>
                <div className='studio-page-card-style'>
                    <p className="center-text"><b>{studioDetails.address}, {studioDetails.postal_code}</b></p>
                    <p className="center-text"><b>{studioDetails.phone_number}</b></p>
                    <a href={`${new URL('https://www.google.com/maps/search/?api=1&query=' + studioDetails.address + ' ' + studioDetails.postal_code).href}`} target='_blank'><Button variant='outlined' style={{ width: '100%' }}>Get Directions</Button></a>
                    <iframe className='studio-page-map' src={`https://maps.google.com/maps?q=${studioDetails.geo_loc[0]},${studioDetails.geo_loc[1]}&hl=es;z=14&output=embed`}></iframe>
                </div>
                {studioDetails.amenities.length > 0 && <div className='studio-page-card-style'>
                    <h2 className="center-text">Amenities</h2>
                    <ul>
                        {studioDetails.amenities.map((amenity, index) => {
                            return (
                                <li key={index}><b>{amenity.type} ({amenity.quantity})</b></li>
                            )
                        })}
                    </ul>
                </div>}
                <div className='studio-page-card-style'>
                    <h2 style={{ 'textAlign': 'center' }}>Classes</h2>
                    <ul style={{ 'display': 'flex', 'listStyle': 'none', 'justifyContent': 'center', 'paddingLeft': 0 }}>
                        <li className='class-search-buttons'>
                            <Button
                                className={!classSearch ? 'class-search-contained' : 'class-search-outlined'}
                                onClick={() => { setClassSearch(false) }}
                                variant={!classSearch ? 'contained' : 'outlined'}>
                                All Classes
                            </Button>
                        </li>
                        <li className='class-search-buttons'>
                            <Button
                                className={classSearch ? 'class-search-contained' : 'class-search-outlined'}
                                onClick={() => { setClassSearch(true) }}
                                variant={classSearch ? 'contained' : 'outlined'}>
                                Search
                            </Button>
                        </li>
                    </ul>
                    {classSearch &&
                        <div className='class-search-section'>
                            <p className='tag-titles'>Coach Name(s)</p>
                            <ReactTags
                                tags={coachNames}
                                delimiters={delimiters}
                                handleDelete={(i) => {
                                    setCoachNames(coachNames.filter((tag, index) => index !== i));
                                }}
                                handleAddition={(tag) => {
                                    setCoachNames([...coachNames, tag]);
                                }}
                                inputFieldPosition="top"
                                autocomplete
                                editable
                            />
                            <p className='tag-titles'>Class name(s)</p>
                            <ReactTags
                                tags={classNames}
                                delimiters={delimiters}
                                handleDelete={(i) => {
                                    setClassNames(classNames.filter((tag, index) => index !== i));
                                }}
                                handleAddition={(tag) => {
                                    setClassNames([...classNames, tag]);
                                }}
                                inputFieldPosition="top"
                                autocomplete
                                editable
                            />
                            <p className='tag-titles'>Date</p>
                            <input
                                type="date"
                                value={date}
                                min={new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                }}
                            >
                            </input>
                            <p className='tag-titles'>Start time</p>
                            <input
                                type="time"
                                value={starttime}
                                onChange={(e) => {
                                    setStarttime(e.target.value);
                                }}
                            >
                            </input>
                            <p className='tag-titles'>End time</p>
                            <input
                                type="time"
                                value={endtime}
                                onChange={(e) => {
                                    setEndtime(e.target.value);
                                }}
                            >
                            </input>
                            <br />
                            <Button className='search-button' style={{ marginTop: '20px', marginBottom: '20px' }} variant="contained" onClick={handleSearchButton}>Search</Button>

                            {searchedClasses.length === 0 && <p className='center-text'>No classes found</p>}
                            {searchedClasses.map((classItem, index) => {
                                return (
                                    <ClassSearchItem key={classItem.class_instance_id} classItem={classItem}></ClassSearchItem>
                                )
                            })}
                            {searchedClasses.length > 0 && <ul style={{ display: 'flex', 'listStyle': 'none', 'justifyContent': 'space-between', "padding": 0, "margin": 0 }}>
                                <li>
                                    <Button variant="contained" disabled={searchedClassesPrev === "" ? true : false} onClick={() => { handleSearchedNextPrev(searchedClassesPrev) }}>Previous</Button>
                                </li>
                                <li>
                                    <Button variant="contained" disabled={searchedClassesNext === "" ? true : false} onClick={() => { handleSearchedNextPrev(searchedClassesNext) }}>Next</Button>
                                </li>
                            </ul>}
                        </div>
                    }
                    {!classSearch &&
                        <div className='class-search-section'>
                            {allClasses.map((classItem, index) => {
                                return (
                                    <ClassItem key={classItem.id} classItem={classItem}></ClassItem>
                                )
                            })}
                            {allClasses.length > 0 && <ul style={{ display: 'flex', 'listStyle': 'none', 'justifyContent': 'space-between', "padding": 0, "margin": 0 }}>
                                <li>
                                    <Button variant="contained" disabled={allClassPrev === "" ? true : false} onClick={() => { handleAllNextPrev(allClassPrev) }}>Previous</Button>
                                </li>
                                <li>
                                    <Button variant="contained" disabled={allClassNext === "" ? true : false} onClick={() => { handleAllNextPrev(allClassNext) }}>Next</Button>
                                </li>
                            </ul>}
                        </div>
                    }
                </div>
            </>}

        </div>
    );
}