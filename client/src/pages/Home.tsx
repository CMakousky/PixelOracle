//imports
import { useState, useEffect, FormEvent } from "react";
import { gameInfoSlug, searchGamesByName } from "../api/searchRAWG";
import { getFavorites, insertFavorites } from "../api/favoriteGames-api";
import { RawgData } from "../interfaces/RawgData";
import RecsPanel from "../components/GameRecs";
import auth from "../utils/auth";
import { UserData } from "../interfaces/UserData";

//return code
export default function Home() {
    // useState for the RAWG search field
    const [search, setSearch] = useState<string>('');
    const handleInputchange = (e: any) => {
        const { value } = e.target;
        setSearch(value);
    };
    // useState for the Seach by Name field
    const [search1, setSearch1] = useState<string>('');
    const handleInputchange2 = (e: any) => {
        const { value } = e.target;
        setSearch1(value);
    };
    // useState for the Favorite Deletion Field
    const [indexSlug, setIndexSlug] = useState<string>('');
    const handleInputchange1 = (e: any) => {
        const { value } = e.target;
        setIndexSlug(value);
    };
    // useState for the saved user favorites
    const [userFavorites, setUserFavorites] = useState<RawgData[]>([{
        name: '',
        slug: '',
        background_image: '',
        released: ''
    }]);
    // useState for pending changes to the user favorites
    const [newFavorites, setNewFavorites] = useState<RawgData[]>([] as RawgData[]);
    
    // useState to track changes to newFavorites
    const [oldFavorites, setOldFavorites] = useState<RawgData[]>([] as RawgData[]);

    // useState for the rendering of recs page
    const [recMessage, setRecMessage] = useState<string>('Consult the Oracle.');
    const [panel, setPanel] = useState<Boolean>(false);
    const [recPanel, setRecPanel] = useState<JSX.Element>(<></>);

    const recButtonHandler = (e: FormEvent) => {
        e.preventDefault();

        if(panel){
            setPanel(false);
            setRecPanel(<></>);
            console.log('setPanel false');
            setRecMessage('Consult the Oracle.');
        } else {
            setPanel(true);
            setRecPanel(<RecsPanel />);
            console.log('setPanel true');
            setRecMessage('Enough of the Oracle.');
        }
    };

    // useState for the current user_id
    const [currentUser, setCurrentUser] = useState<number>(0);

    // Function to extract current user ID from JWT
    const extractJWT = () => {
        const loggedIn = auth.loggedIn();
        console.log(loggedIn);
        if (loggedIn) {
            const token: UserData = auth.extractID() as UserData;
            console.log(token);
            setCurrentUser(token.id);
        } else {
            console.log("Please login to view saved favorites.");
            setCurrentUser(0);
        };
        return;
    };

    // Troubleshooting function to display useState for the saved user favorites
    // const viewCurrentFavorites = async () => {
    //     console.log("CURRENT FAVORITES:"userFavorites)};

    // Troubleshooting function to display useState for pending changes to the user favorites
    // const viewNewFavorites = async () => {
    //     console.log("PENDING FAVORITES LIST:", newFavorites);
    // };

    // Function to clean the reply data from RAWG
    const cleanResults = async (data: RawgData) => {
        const conversion = [{
            name: `${data.name}`,
            slug: `${data.slug}`,
            background_image: `${data.background_image}`,
            released: `${data.released}`
        }]
        console.log('RAWG API reply cleaned to match custom RawgData type format.', conversion);
        return conversion;
    };

    // Function to concatenate the user favorites with the new favorite selection
    const concatenateThings = async (things: RawgData[]) => {
        let favoritesArray = [...userFavorites, ...things]
        if (newFavorites.length !== 0) {favoritesArray = [...newFavorites, ...things]};
        return favoritesArray;
    };

    // Function to retrieve favorite games list by user_id
    const getUserFavorites = async () => {
        try {
            const data: RawgData[] = await getFavorites(currentUser);
            // Update the "userFavorites" useState with data retrieved from server
            setUserFavorites(data);
            return data;
        } catch (err) {
            console.error('No matches found!', err);
        }
    };

    // Function to display saved user favorites
    const displayUserFavorites = async () => {
        try {
            const savedFavorites = await getUserFavorites();
            console.log("SAVED FAVORITES:", savedFavorites);
        } catch (err) {
            console.error('No matches found!', err);
        }
    };

    // Function to insert updated favorites list into SQL server
    const updateFavorites = async () => {
        if (newFavorites.length !== 0 && newFavorites !== oldFavorites) {
            await insertFavorites(currentUser, newFavorites);
            setOldFavorites(newFavorites);
        } else {
            console.log("NO PENDING CHANGES TO FAVORITES.");
        }
    };

    // Function that uses a text input to retrieve a game from RAWG by slug, and then add the results to PENDING FAVORITES CHANGES
    const searchGamesBySlug = async (event: FormEvent, gameSlug: string) => {
        event.preventDefault();
        try {
            // Search RAWG database for game info by slug
            const data = await gameInfoSlug(gameSlug);
            console.log(data);
            // Clean the data to match the custom RawgData type
            const cleanData = await cleanResults(data);
            console.log("Appending search results to Pending Favorites List.");
            // Concatenate the cleaned data with the array of existing user favorites
            const newArray = await concatenateThings(cleanData);
            console.log("PENDING FAVORITES LIST:", newArray);
            // Update the "newFavorites" useState with the favoritesArray
            setNewFavorites(newArray);
        } catch (err) {
            console.error('No matches found!', err);
        }
    };

    // Function to locate the index of a specific favorite object and remove it from the array
    const removeFavoriteBySlug = async (event: FormEvent, slug: string) => {
        event.preventDefault();
        try {
            let resultsIndex;
            if (newFavorites.length === 0) {
                resultsIndex = userFavorites.findIndex((element) => (element.slug === `${slug}`));
            } else {
                resultsIndex = newFavorites.findIndex((element) => (element.slug === `${slug}`));
            };
            if (resultsIndex !== -1) {
                console.log(`Flagging favorite at index ${resultsIndex} of array for deletion.`);
                // Slice the contents of userFavorites from index zero up to, but not including, resultsIndex into arrayLeft
                const arrayLeft = userFavorites.slice(0, resultsIndex);
                // Slice the contents of userFavorites from resultsIndex into arrayLeft
                const arrayRight = userFavorites.slice(resultsIndex+1);
                console.log("PENDING FAVORITES LIST:", [...arrayLeft, ...arrayRight]);
                // Update the "newFavorites" useState with [...arrayLeft, ...arrayRight]
                setNewFavorites([...arrayLeft, ...arrayRight]);
            } else {console.log(`Choose a slug from your favorites list.`)};

        } catch (err) {
            console.error('No matches found!', err);
        }
    };

    // Function stack above functions to automatically add info to games database
    const addRAWGtoFavorites = async (event: FormEvent, gameTitle: string) => {
        event.preventDefault();
        //Search RAWG for game by name
        try {
            const search = await searchGamesByName(gameTitle);
            console.log("Search Results:", search);
            // Select the first result in the returned search data array
            const fav: RawgData = search[0];
            // Clean the data to match the custom RawgData type
            const conversion: RawgData[] = await cleanResults(fav);
            // Concatenate the cleaned data with the array of existing user favorites
            const favoritesArray = await concatenateThings(conversion);
            // console.log('CONCAT', favoritesArray);
            console.log('PENDING FAVORITES LIST:', favoritesArray);
            // Update the "newFavorites" useState with the favoritesArray
            setNewFavorites(favoritesArray);

        } catch (error) {
            console.error('No Matches Found!', error);
        }
    };

    useEffect(() => {extractJWT();}, []);

    return (
        <>
            <div className="homeBanner">
                <h1>PixelOracle</h1>
                <p>Need a new game? Consult the Oracle...</p>
                {/* background image - simple texture */}
            </div>

            <form>
                <button type="button" onClick={() => displayUserFavorites()}>DISPLAY SAVED FAVORITES</button>
                <button type="button" onClick={() => updateFavorites()}>UPDATE FAVORITES LIST</button>
                {/* <button type="button" onClick={() => viewNewFavorites()}>VIEW PENDING FAVORITES CHANGES</button> */}
            </form>

            {/* search bar to build rawg request */}
            <form className="searchArea" onSubmit={(event: FormEvent) => searchGamesBySlug(event, search)}>
                <input
                    value={search}
                    placeholder="Find a Game by Slug!"
                    id="search"
                    onChange={handleInputchange}
                />
                <button type="submit">EXACT SLUG SEARCH</button>
            </form>

            <form className="searchArea" onSubmit={(event: FormEvent) => addRAWGtoFavorites(event, search1)}>
                <input
                    value={search1}
                    placeholder="Find a Game by Title!"
                    id="search"
                    onChange={handleInputchange2}
                />
                <button type="submit">SEARCH BY TITLE</button>
            </form>

            <form className="searchArea" onSubmit={(event: FormEvent) => removeFavoriteBySlug(event, indexSlug)}>
                <input
                    value={indexSlug}
                    placeholder="Flag Favorite for Deletion by Slug."
                    id="locateIndex"
                    onChange={handleInputchange1}
                />
                <button type="submit">FLAG FAVORITE FOR REMOVAL</button>
            </form>

            <form onSubmit={(event: FormEvent) => recButtonHandler(event)}>
                <button type="submit">{recMessage}</button>
            </form>

            {recPanel}

            <p>Or pick from the list below!</p>
            {/* <GameList /> */}
        </>
    );
}