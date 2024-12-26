import { RawgData } from "../interfaces/RawgData";

type GameCardProps = {
    game: RawgData;
};

const GameCard = ({ game }: GameCardProps) => {
    return (
        <>
            <section className="gameCard" id={`${game.slug}`}>
                <figure>
                    <img src={`${game.background_image}`} alt={`${game.slug}`} />
                </figure>
                <article className="details">
                    <h2>{`Title: ${game.name}`}</h2>
                    <h2>{`Slug: ${game.slug}`}</h2>
                    <h2>{`Released: ${game.released}`}</h2>
                </article>
            </section>
        </>
    );
};

export default GameCard;