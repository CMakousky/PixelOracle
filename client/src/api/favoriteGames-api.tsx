import { RawgData } from "../interfaces/RawgData";
import type { RegisterUser } from "../interfaces/RegisterUser";

const getFavorites = async (user_id: number) => {
    try {
        const response = await fetch(`/api/users/getFavorites/${user_id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        });
        const data = await response.json();
        if(!response.ok) {
        throw new Error('invalid user ID!');
        }
        return data;
    } catch (err) {
        console.log('Error from data retrieval:', err);
        return Promise.reject('No matches for that search criteria');
    }
};

const insertFavorites = async (user_id: number, newFavorites: RawgData[]) => {
    console.log(`UPDATING FAVORITES LIST.`);
    try {
        const request = await fetch(`/api/users/addFavoriteGames/${user_id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method:"PUT",
        body: JSON.stringify({"favorites": newFavorites})
        });
        if(!request.ok) {
        throw new Error('invalid RAWG API response, check network tab!');
        }
    } catch (err) {
        console.log('Error from data retrieval:', err);
        return Promise.reject('No matches for that search criteria');
    }
};

const newUser = async (newUserData: RegisterUser) => {
    console.log(`REGISTERING ${newUserData.username}.`);
    try {
        const request = await fetch(`/api/users/`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method:"POST",
        body: JSON.stringify(
            {
                "username": newUserData.username,
                "email": newUserData.email,
                "password": newUserData.password
            })
        });
        if(!request.ok) {
        throw new Error('Registration Failed, check network tab!');
        }
    } catch (err) {
        console.log('Error on data insertion:', err);
        return Promise.reject('Unable to register user.');
    }
};

export { getFavorites, insertFavorites, newUser };