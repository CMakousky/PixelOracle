import { RawgData } from "../interfaces/RawgData";

type GameCardProps = {
    game: RawgData;
    removeFavoriteBySlug(slug: string, savedFavorites: RawgData[], pendingFavorites: RawgData[]): Promise<void>;
    savedFavorites: RawgData[];
    pendingFavorites: RawgData[];
};

const GameCard = ({ game, removeFavoriteBySlug, savedFavorites, pendingFavorites }: GameCardProps) => {
    return (
        <>
            <section className="gameCard" id={`${game.slug}`}>
                <figure>
                    <img src={`${game.background_image}`} alt={`${game.slug}`} />
                </figure>
                <article className="details">
                    <h2>Title:<br />{game.name}</h2>
                    <h2>Slug:<br />{game.slug}</h2>
                    <h2>Released:<br />{game.released}</h2>
                </article>
                <button 
                    className="arrayButton" 
                    type="button" 
                    onClick={() => {
                        removeFavoriteBySlug(game.slug as string, savedFavorites, pendingFavorites)}}>
                        Delete {game.name}
                </button>
            </section>
        </>
    );
};

export default GameCard;