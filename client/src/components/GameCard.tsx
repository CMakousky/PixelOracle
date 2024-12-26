import { RawgData } from "../interfaces/RawgData";

type GameCardProps = {
    game: RawgData;
};

const GameCard = ({ game }: GameCardProps) => {
    return (
        <>
            <section className="gameCard">
                <figure>
                    <img src={`${game.background_image}`} alt={`${name}`} />
                </figure>
                <article className="details">
                    <h2>{game.name}</h2>
                    <h2>{`Released: ${game.released}`}</h2>
                </article>
            </section>
        </>
    );
};

export default GameCard;