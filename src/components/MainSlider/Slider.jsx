import React, { useEffect, useState } from 'react'
import SliderInner from './SliderInner'
import { makeAjax, respStatus, showMessage, url } from "../../helpers/global_helper";


const Slider = ({ searchText }) => {
  const [gameList, setGameList] = useState([]);

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
    <SliderInner gameList={gameList} searchText={searchText} />
  )
}

export default Slider