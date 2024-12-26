import { getFavorites } from "./favoriteGames-api";
import { RawgData } from "../interfaces/RawgData";
import auth from "../utils/auth";

function getRandomGame(gameArray: string[]) {
    const randomIndex = Math.floor(Math.random() * gameArray.length);
    return gameArray[randomIndex];
}

function buildGeminiArray(favsArray: RawgData[]): string[] {
    let rawArray = [];
    let finalArray = [];
    //Grab names from RawgData and create new string array
    for (let i = 0; i < favsArray.length; i++) {
        let game = favsArray[i].name;
        if (game === null) {
            game = '';
        };
        rawArray.push(game);
    }
    //List Length Reducer - 5 item maximum
    if (rawArray.length <= 5) {
        console.log('List Length Reducer Initiated:');

        for (let i = 0; i <= 4; i++) {
            const randomGame = getRandomGame(rawArray);
            finalArray.push(randomGame);
        }

    } else {

        for (let i = 0; i < rawArray.length; i++){
            const serialGame = rawArray[i];
            finalArray.push(serialGame);
        }

    }

    console.log('GeminiArray Created', rawArray);
    return finalArray;
}


export const getRec = async () => {
    try {
        let user: number = 0;
        user = auth.selectUser();
        const favsArray = await getFavorites(user);
        const geminiArray = buildGeminiArray(favsArray);
        const paramArray = geminiArray.toString();

        const response = await fetch(`/api/Gemini/${paramArray}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.getToken()}`
            },
            method: 'GET',
        })

        const data = await response.json();
        // this below was commented out previously without the ! in line 7.
        // if (!response.ok) {
        //     throw new Error('Invalid API Response - FSAPIROUTE - GEMINIFETCH1');
        // };

        return data;
    } catch (error) {
        console.log('Error - FSAPIROUTE - GEMINIFETCH2', error);
        return [{ title: '', summary: '' }, { title: '', summary: '' }, { title: '', summary: '' }];
    }
};