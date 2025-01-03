//imports
import { useState, useEffect, FormEvent } from "react";
import { gameInfoSlug, searchGamesByName } from "../api/searchRAWG";
import { getFavorites, insertFavorites } from "../api/favoriteGames-api";
import { RawgData } from "../interfaces/RawgData";
import RecsPanel from "../components/GameRecs";
import auth from "../utils/auth";
import GameCard from "../components/GameCard";

//return code
export default function Home() {
    // useState for the current user_id
    const [currentUser, setCurrentUser] = useState<number>(0);

    // useState to display the current userName
    const [loginBanner, setLoginBanner] = useState<JSX.Element>(<></>);

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
    const [userFavorites, setUserFavorites] = useState<RawgData[]>([] as RawgData[]);
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

    // useState for rendering GameCards
    const [cardArray, setCardArray] = useState<JSX.Element>(<></>);

    // Function to create an array of display cards
    const showCards = async (favorites: RawgData[]) => {
        return(
            <>
                <section className="displayCards">
                    {favorites.map(
                            (favoriteGame: RawgData) => {
                                return(
                                    <>
                                        <GameCard 
                                            game={favoriteGame}
                                            removeFavoriteBySlug={removeFavoriteBySlug}
                                            savedFavorites={favorites}
                                            pendingFavorites={newFavorites}
                                        />
                                    </>
                                )
                            }
                        )
                    }
                </section>
            </>
        );
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
        const conversion: RawgData[] = [{
            name: `${data.name}`,
            slug: `${data.slug}`,
            background_image: `${data.background_image}`,
            released: `${data.released}`
        }];
        console.log('RAWG API reply cleaned to match custom RawgData type format.', conversion);
        return conversion;
    };

    // Function to concatenate the user favorites with the new favorite selection
    const concatenateThings = async (savedThings: RawgData[], pendingThings: RawgData[], things: RawgData[]) => {
        let favoritesArray = [...savedThings, ...things];
        if (newFavorites.length !== 0) {favoritesArray = [...pendingThings, ...things]};
        return favoritesArray;
    };

    // Function to retrieve favorite games list by user_id
    const getUserFavorites = async () => {
        try {
            if (currentUser !== 0) {
                const data: RawgData[] = await getFavorites(currentUser);
                // Update the "userFavorites" useState with data retrieved from server
                setUserFavorites(data);
                // Clear the newFavorites useState
                const clearNewFavorites = [] as RawgData[];
                setNewFavorites(clearNewFavorites);
                return data;
            };
        } catch (err) {
            console.error('No matches found!', err);
        }
    };

    // Function to display saved user favorites
    const displayUserFavorites = async () => {
        try {
            const savedFavorites = await getUserFavorites();
            if (savedFavorites !== undefined && savedFavorites.length > 0) {
                setCardArray( await showCards(savedFavorites));
                console.log("SAVED FAVORITES:", savedFavorites);
            } else {setCardArray(<><h2>PLEASE LOGIN TO VIEW <br /> SAVED FAVORITES.</h2></>)};

        } catch (err) {
            console.error('No saved favorites to display!', err);
        }
    };

    // Function to insert updated favorites list into SQL server
    const updateFavorites = async () => {
        if (newFavorites.length !== 0 && newFavorites !== oldFavorites) {
            await insertFavorites(currentUser, newFavorites);
            setOldFavorites(newFavorites);
            // await displayUserFavorites();
            setCardArray(<><h2 className="statusDisplay">FAVORITES UPDATED!</h2></>);
        } else {
            console.log("NO PENDING CHANGES TO FAVORITES.");
            setCardArray(<><h2 className="statusDisplay">NO PENDING CHANGES <br /> TO FAVORITES.</h2></>);
        }
    };

    // Function that uses a text input to retrieve a game from RAWG by slug, and then add the results to PENDING FAVORITES CHANGES
    const searchGamesBySlug = async (event: FormEvent, gameSlug: string) => {
        event.preventDefault();
        try {
            // Search RAWG database for game info by slug
            const data: RawgData = await gameInfoSlug(gameSlug);
            console.log(data);
            // Clean the data to match the custom RawgData type
            const cleanData: RawgData[] = await cleanResults(data);
            console.log("Appending search results to Pending Favorites List.");
            // Concatenate the cleaned data with the array of existing user favorites
            const newArray: RawgData[] = await concatenateThings(userFavorites, newFavorites,  cleanData);
            console.log("PENDING FAVORITES LIST:", newArray);
            // Update the "newFavorites" useState with the favoritesArray
            setNewFavorites(newArray);
            // Display the Pending Favorites List
            setCardArray(await showCards(newArray));
        } catch (err) {
            console.error('No matches found!', err);
        }
    };

    // Function to locate the index of a specific favorite object and remove it from the array
    const removeFavoriteBySlug = async (slug: string, savedFavorites: RawgData[], pendingFavorites: RawgData[]) => {
        try {
            // Initialize local variable resultsIndex
            let resultsIndex: number;
            // Function to remove the item at location resultsIndex from the selected favoritesArray
            const removeFromFavorites = (resultsIndex: number, favoritesArray: RawgData[]) => {
                console.log(`Flagging favorite at index ${resultsIndex} of array for deletion.`);
                // Slice the contents of favoritesArray from index zero up to, but not including, resultsIndex into arrayLeft
                const arrayLeft: RawgData[] = favoritesArray.slice(0, resultsIndex);
                // Slice the contents of favoritesArray from resultsIndex into arrayLeft
                const arrayRight: RawgData[] = favoritesArray.slice(resultsIndex+1);
                // Concatenate arrayLeft and arrayRight
                const newArray: RawgData[] = [...arrayLeft, ...arrayRight];
                console.log("PENDING FAVORITES LIST:", newArray);
                // Update the "newFavorites" useState with newArray
                setNewFavorites(newArray);
                return newArray;
            };
            if (pendingFavorites.length === 0) {
                resultsIndex = savedFavorites.findIndex((element) => (element.slug === `${slug}`));
            } else {
                resultsIndex = pendingFavorites.findIndex((element) => (element.slug === `${slug}`));
            };
            if (resultsIndex !== -1 && pendingFavorites.length === 0) {
                // Remove the item at location resultsIndex from savedFavorites
                const newArray = removeFromFavorites(resultsIndex, savedFavorites);
                // Display the game cards for pending favorites
                setCardArray(await showCards(newArray));
            } else if (resultsIndex !== -1 && pendingFavorites.length !== 0) {
                // Remove the item at location resultsIndex from pendingFavorites
                const newArray = removeFromFavorites(resultsIndex, pendingFavorites);
                // Display the game cards for pending favorites
                setCardArray(await showCards(newArray));
            } else {console.log(`Choose a slug from your favorites list.`)};
        } catch (err) {
            console.error('Failed to execute removeFavoriteBySlug!', err);
        };
    };

    // Function stack above functions to automatically add info to games database
    const addRAWGtoFavorites = async (event: FormEvent, gameTitle: string) => {
        event.preventDefault();
        //Search RAWG for game by name
        try {
            const search: RawgData[] = await searchGamesByName(gameTitle);
            console.log("Search Results:", search);
            // Select the first result in the returned search data array
            const fav: RawgData = search[0];
            // Clean the data to match the custom RawgData type
            const conversion: RawgData[] = await cleanResults(fav);
            // Concatenate the cleaned data with the array of existing user favorites
            const favoritesArray: RawgData[] = await concatenateThings(userFavorites, newFavorites, conversion);
            // console.log('CONCAT', favoritesArray);
            console.log('PENDING FAVORITES LIST:', favoritesArray);
            // Update the "newFavorites" useState with the favoritesArray
            setNewFavorites(favoritesArray);
            // Display the game cards for pending favorites
            setCardArray(await showCards(favoritesArray));
        } catch (error) {
            console.error('No Matches Found!', error);
        }
    };

    useEffect(() => {
        const user = auth.selectUser();
        if (user !== 0) {
            console.log(auth.getProfile());
            const userName = auth.getUserName();
            setLoginBanner(<><h2 id="loginBanner">Welcome {`${userName}`}!</h2></>);
        };
        setCurrentUser(user);
    }, []);

    return (
        <>
            <div className="homeBanner">
                <h1>PixelOracle</h1>
                {loginBanner}
                <p>Need a new game? Consult the Oracle...</p>
                {/* background image - simple texture */}
            </div>

            <form>
                <button type="button" onClick={() => displayUserFavorites()}>DISPLAY SAVED FAVORITES</button>
                <button type="button" onClick={() => updateFavorites()}>UPDATE FAVORITES LIST</button>
                {/* <button type="button" onClick={() => viewNewFavorites()}>VIEW PENDING FAVORITES CHANGES</button> */}
            </form>

            {cardArray}

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

            <form className="searchArea" 
                onSubmit={(event: FormEvent) => {
                    event.preventDefault();
                    removeFavoriteBySlug(indexSlug, userFavorites, newFavorites);
                    }}>
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