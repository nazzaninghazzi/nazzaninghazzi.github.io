export const API_URL = 'http://localhost:8000';


/**
 * Authenticate user on every page
 */
export async function authenticateUser() {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
        const response = await fetch(`${API_URL}/accounts/login/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`,
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
    }
    return false;
}

/**
 * Search studio with given filters and return the results
 */
export async function searchStudios(latlong, studioName, coachNames, classNames, amenities) {
    const url = `${API_URL}/studios/search/?`;
    const method = 'GET';
    const params = {
        location: latlong,
    }
    if (studioName.length > 0) {
        params.studioname = studioName;
    }
    if (coachNames.length > 0) {
        params.coach = '';
        coachNames.forEach((coachName, index) => {
            if (index !== 0) {
                params.amenities += ',';
            }
            params.coach += `${coachName.text}`;
        });
    }
    if (classNames.length > 0) {
        params.classes = '';
        classNames.forEach((className, index) => {
            if (index !== 0) {
                params.amenities += ',';
            }
            params.classes += `${className.text}`;
        });
    }
    if (amenities.length > 0) {
        params.amenities = '';
        amenities.forEach((amenity, index) => {
            if (index !== 0) {
                params.amenities += ',';
            }
            params.amenities += `${amenity.text}`;
        });
    }
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url + new URLSearchParams(params),
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            }
        });
    return response;
}

/**
 * Used to get pagination results, provided a url to the next page
 */
export async function paginationSearch(link) {
    const method = 'GET';
    
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(link,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            }
        });
    return response;
}


export async function signInUser(username, password) {
    const url = `${API_URL}/api/token/`
    const method = 'POST';

    const response = await fetch(url,
        {
            method,
            headers:{
                'Content-Type': "application/json"
            },
            body: JSON.stringify({"username": username, "password": password})
        });
    return response;
}

export async function signUpUser(username, password, password2, firstName, lastName, email,
                                 phoneNumber, avatar) {
    const url = `${API_URL}/accounts/register/`
    const method = 'POST';
    let formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)
    formData.append("password2", password2)
    formData.append("first_name", firstName)
    formData.append("last_name", lastName)
    formData.append("email", email)
    formData.append("phone_number", phoneNumber)
    formData.append("avatar", avatar)

    const response = await fetch(url,
        {
            method,

            body: formData
        });

    return response;
}

export async function getInfoUser() {
    const url = `${API_URL}/accounts/login/`
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

/**
 * Get studio details
 */
export async function getStudioDetails(studioId) {
    const url = `${API_URL}/studios/${studioId}/details/`;
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

export async function getSubscriptions(page) {
    const url = `${API_URL}/subscriptions/all/?page=${page}`
    const userToken = localStorage.getItem('userToken');
    const method = 'GET';

    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}


export async function subscribeUser(subscriptionId) {
    const url = `${API_URL}/subscriptions/subscribe/?subscription_id=${subscriptionId}`
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

export async function unsubscribeUser() {
    const url = `${API_URL}/subscriptions/unsubscribe/`
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

/**
 * Get studio classes
 */
export async function getStudioClasses(studioId) {
    const url = `${API_URL}/classes/studio/${studioId}/details/`;
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

export async function getFuturePayments(page) {
    const url = `${API_URL}/accounts/payment/future/?page=${page}`
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');

    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}
/**
 * Get studio classes via search
 */
export async function searchStudioClasses(studio_id, class_name, coach, date, time_range) {
    const url = `${API_URL}/classes/search/?`;
    const method = 'GET';
    const params = {
        studio_id,
    }
    if (class_name.length > 0) {
        params.class_name = class_name;
    }
    if (coach.length > 0) {
        params.coach = coach;
    }
    if (date.length > 0) {
        params.date = date;
    }
    if (time_range.length > 0) {
        params.time_range = time_range;
    }
    console.log(params);
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url + new URLSearchParams(params),
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

export async function getPreviousPayments(page) {
    const url = `${API_URL}/accounts/payment/history/?page=${page}`
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}
/**
 * Enroll user in class
 */
export async function enrollInClass(classId, date) {
    const url = `${API_URL}/classes/enroll/`;
    const method = 'POST';
    const userToken = localStorage.getItem('userToken');
    const body = {
        class_instance_id: classId,
    }
    if (date) {
        body.date = date;
    }
    let formData = new FormData();
    formData.append('class_instance_id', classId);
    if (date) {
        formData.append('date', date);
    }
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
            body: formData,
        });
    return response;
}

export async function updateCardUser(number, cvv, expiration, postal_code) {
    const url = `${API_URL}/accounts/update_card/`
    const method = 'POST';
    const userToken = localStorage.getItem('userToken');

    const response = await fetch(url,
        {
            method,
            headers:{
                'Content-Type': "application/json",
                Authorization: 'Bearer ' + userToken
            },
            body: JSON.stringify({"number": number, "cvv": cvv, "expiration": expiration, "postal_code": postal_code})
        });
    return response;
}

export async function editUser(username, password, password2, firstName, lastName, email,
                               phoneNumber, avatar) {
    const url = `${API_URL}/accounts/edit/${username}/`
    const method = 'PUT';
    const userToken = localStorage.getItem('userToken');
    let formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)
    formData.append("password2", password2)
    formData.append("first_name", firstName)
    formData.append("last_name", lastName)
    formData.append("email", email)
    formData.append("phone_number", phoneNumber)
    formData.append("avatar", avatar)

    const response = await fetch(url,
        {
            method,
            headers:{
                Authorization: 'Bearer ' + userToken
            },

            body: formData
        });

    return response;
}


export async function getClassSchedule() {

    const url = `${API_URL}/classes/schedule/`
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

export async function getClassHistory(page) {
    const url = `${API_URL}/classes/history/?page=${page}`
    const method = 'GET';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        });
    return response;
}

export async function dropOneClass(class_instance_id, date) {
    const url = `${API_URL}/classes/drop/`
    const method = 'POST';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                'Content-Type': "application/json",
                Authorization: 'Bearer ' + userToken,
            },
            body: JSON.stringify({"class_instance_id": class_instance_id, "date": date})
        });

    return response;
}

export async function dropAllClasses(class_instance_id) {
    const url = `${API_URL}/classes/drop/`
    const method = 'POST';
    const userToken = localStorage.getItem('userToken');
    const response = await fetch(url,
        {
            method,
            headers: {
                'Content-Type': "application/json",
                Authorization: 'Bearer ' + userToken,
            },
            body: JSON.stringify({"class_instance_id": class_instance_id})
        });
    return response;
}