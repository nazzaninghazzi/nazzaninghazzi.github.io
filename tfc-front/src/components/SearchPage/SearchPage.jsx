import './SearchPage.css';
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { WithContext as ReactTags } from 'react-tag-input';
import postalCodesToLatLong from '../../data/output.js';
import { searchStudios, paginationSearch } from '../../api/api';
import ResultsView from './ResultsView/ResultsView';
import Map from "../Map/Map";

export default function SearchPage() {

    const [postalCode, setPostalCode] = useState("");
    const [loc, setLoc] = useState("");
    const [locError, setLocError] = useState("");
    const [studioName, setStudioName] = useState("");
    const [coachNames, setCoachNames] = useState([
    ]);
    const [classNames, setClassNames] = useState([
    ]);
    const [amenities, setAmenities] = useState([
    ]);
    const [studios, setStudios] = useState([]);
    const [getStudioError, setGetStudioError] = useState(false);
    const [nextPage, setNextPage] = useState("");
    const [prevPage, setPrevPage] = useState("");
    const [noStudio, setNoStudio] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showMapBtn, setShowMapBtn] = useState(false)
    const [showMap, setShowMap] = useState(false)


    useEffect(() => {
        setGetStudioError(false);
        setNoStudio(false);
    }, [postalCode,
        loc,
        studioName,
        coachNames,
        classNames,
        amenities,]);
    
    // 13 is the enter key, 188 is the comma key
    const delimiters = [13, 188];

    // Sanitize the postal code
    const handlePostalCode = (e) => {
        // sanitize input
        if (e.target.value.length > 7) {
            return;
        }
        if (e.target.value.length === 3 && 2 === postalCode.length) {
            e.target.value += " ";
        }
        e.target.value = e.target.value.toUpperCase();
        setPostalCode(e.target.value);
    }

    // When user edits the postalcode, remove the error message
    useEffect(() => {
        setLocError("");
    }, [postalCode, loc]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSearchButton = async () => {
        let lloc = '';
        // first check if there is a location
        if (loc.length === 0 && postalCode.length !== 7) {
            // if there is no location and no postal code, error
            setLocError("Please enter a location. It is required.");
            return;
        }
        if (loc.length === 0) {
            // if there is no location but there is a postal code, use the postal code
            console.log("postal code: " + postalCode);
            console.log(postalCodesToLatLong[postalCode[0] + postalCode[1] + postalCode[2]]);
            lloc = postalCodesToLatLong[postalCode[0] + postalCode[1] + postalCode[2]];
        }
        // if there is a location, use the location
        else {
            lloc = loc;
        }
        const res = await searchStudios(
            lloc, studioName, coachNames, classNames, amenities);
        setLoc("");
        if (res.status === 200) {
            const data = await res.json();
            if (data.results.length === 0) {
                setStudios([]);
                setNoStudio(true);
                return;
            }
            setStudios(data.results);
            setNextPage(data.next ? data.next : "");
            setPrevPage(data.previous ? data.previous : "");
            setShowMapBtn(true)

        }
        else {
            setGetStudioError(true);
        }
    }
    const handleNextPrev = async (url) => {
        const res = await paginationSearch(url);
        if (res.status === 200) {
            const data = await res.json();
            if (data.results.length === 0) {
                setStudios([]);
                setNoStudio(true);
                return;
            }
            setStudios(data.results);
            setNextPage(data.next ? data.next : "");
            setPrevPage(data.previous ? data.previous : "");
        }
        else {
            setGetStudioError(true);
        }
    }

    return (
        <div className="search-page">
            <h2 className="search-title">Search Studios</h2>
            <ul className="input-location">
                <li>Postal Code:</li>
                <li><input type="text" value={postalCode} placeholder='A1A 1A1' onChange={(txt) => {
                    handlePostalCode(txt);
                }} /></li>
                {"geolocation" in navigator && <><li>  OR  </li>
                <li><Button className='get-my-loc-button' variant="contained" onClick={() => {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        console.log(position)
                        setLoc(position.coords.latitude + "," + position.coords.longitude);
                      }, function(error) {
                        console.log(error)
                        setLocError("Error getting location, try Postal Code instead");
                        });
                }}>Use my Location</Button></li></>}
            </ul>
            {locError && <div className="error"> {locError} </div>}
            <ul style={{display: 'flex', 'listStyle': 'none', 'justifyContent': 'flex-start', 'alignItems': 'center', "padding": 0, "margin": 0}}>
                <li><h3>Filters (optional):</h3></li>
                <li style={{'marginLeft': '15px'}}>
                    <Button
                        variant="contained"
                        style={{'backgroundColor': '#f3ad5c'}}
                        onClick={() => {setShowFilters(!showFilters)}}>
                            {showFilters ? 'Hide': 'Show'}
                    </Button>
                </li>
            </ul>
            {showFilters && <>
            <ul className="input-location">
                <li>Studio Name</li>
                <li><input type="text" value={studioName} placeholder='Name of studio' onChange={(txt) => {
                    setStudioName(txt.target.value);
                }} /></li>
            </ul>
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
            <p className='tag-titles'>Amenities</p>
            <ReactTags
                tags={amenities}
                delimiters={delimiters}
                handleDelete={(i) => {
                    setAmenities(amenities.filter((tag, index) => index !== i));
                  }}
                handleAddition={(tag) => {
                    setAmenities([...amenities, tag]);
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
            </>}
            <Button className='search-button' style={{marginTop: '20px'}} variant="contained" onClick={handleSearchButton}>Search</Button>
            <br/><br/>
            {showMapBtn &&
                <Button className='search-button' style={{marginTop: '20px'}}
                        variant="contained" onClick={() => setShowMap(!showMap)}>
                    {showMap ? 'Hide Map' : 'Show Map'}
                </Button>}
            <br/><br/>
            {showMap && <Map/>}
            <ResultsView studios={studios}></ResultsView>

            {getStudioError && <p style={{'color': 'red'}}>Error, could not get studios</p>}
            {noStudio && <p>No studios found</p>}
            { studios.length > 0 && <ul style={{display: 'flex', 'listStyle': 'none', 'justifyContent': 'space-between', "padding": 0, "margin": 0}}>
                <li>
                    <Button variant="contained" disabled={prevPage === "" ? true : false} onClick={() => {handleNextPrev(prevPage)}}>Previous</Button>
                </li>
                <li>
                    <Button variant="contained" disabled={nextPage === "" ? true : false} onClick={() => {handleNextPrev(nextPage)}}>Next</Button>
                </li>
            </ul>}
        </div>
    )
}