import React, { useEffect, useState } from 'react'
import "./games.css";
import { makeAjax, respStatus, showMessage, url } from '../../helpers/global_helper';

const Games = () => {

    const gameImageMap = {
        goldrush: "./assets/images/games/mines.png",
        crash: "./assets/images/games/crash.png",
        pyramidplinko: "./assets/images/games/pyramid-plinko.png",
        dice: "./assets/images/games/dice.png",
        hilo: "./assets/images/games/hilo.png",
        keno: "./assets/images/games/KENO.png",
        coinflip: "./assets/images/games/Coin-flip.png",
        cross: "./assets/images/games/BB-cross.png",
        tower: "./assets/images/games/tower.png",
    };

    const [gameList, setGameList] = useState([]);

    const gamesWithImages = gameList
        .filter(game => gameImageMap[game.game_name.toLowerCase().replace(/\s+/g, '')])
        .map(game => ({
            ...game,
            image: gameImageMap[game.game_name.toLowerCase().replace(/\s+/g, '')],
        }));

    const fetchGameList = async () => {
        const response = await makeAjax(url.ARCADE_API.gameList, {}, url.ARCADE_MS_EXT);
        if (response.status !== respStatus["SUCCESS"]) {
            showMessage(response);
            return;
        }
        let games = response.data.slice();
        let gameCount = games.length;

        while (gameCount < 7) {
            const remaining = 7 - gameCount;
            const toAdd = games.slice(0, remaining);
            games = games.concat(toAdd);
            gameCount = games.length;
        }

        setGameList(games);
    };

    useEffect(() => {
        fetchGameList();
    }, []);


    return (
        <div className='main_game_div'>
            {gamesWithImages.map((game, index) => (
                <div className="game-container" key={game.game_id || index}>
                    <div className="card_box">
                        <img className="card_image" src={game.image} alt={game.game_code + game.game_id} />
                        <span></span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Games
