import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import IframeLauncher from "../LobbyContent/IframeLauncher";
import { withTranslation } from "react-i18next";
import { makeAjax, showMessage, url } from "../../helpers/global_helper";

const SliderInner = ({ gameList, searchText, t }) => {


  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [autoplay, setAutoplay] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    let timer;
    if (!autoplay) {
      timer = setTimeout(() => {
        setAutoplay(true);
        if (sliderRef.current) {
          sliderRef.current.slickPlay();
        }
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [autoplay]);

  const getBestMatchingGameIndex = (games, searchText, aliasMap = {}) => {
   
    if (!searchText || searchText.trim() === "") return -1;

    const lowerSearch = searchText.toLowerCase().replace(/\s+/g, "");
    const mappedName = aliasMap[lowerSearch];
    // const matchedAliasKey = Object.keys(aliasMap).find(aliasKey =>
    //   aliasKey.startsWith(lowerSearch)
    // );
    //  const mappedName = matchedAliasKey ? aliasMap[matchedAliasKey] : null;
     
    const scoredGames = games.map((game, index) => {
      const name = game.game_name.toLowerCase().replace(/\s+/g, "");
      let score = 0;
      if (mappedName && name === mappedName) score += 10;
      if (name.startsWith(lowerSearch)) score += 3;
      if (name.includes(lowerSearch)) score += 2;
      const indexOfMatch = name.indexOf(lowerSearch);

      if (indexOfMatch !== -1) {
        score += 1 / (indexOfMatch + 1);
      }

      return { index, score };
    });

    scoredGames.sort((a, b) => b.score - a.score);

    const bestMatch = scoredGames.find(g => g.score > 0);
    return bestMatch?.index ?? -1;
  };

  const handleCloseIframe = () => {
    setShowIframe(false);
    setIframeUrl("");
  };

  const handleLaunchGame = async (game) => {
    const reqData = {
      roomId: game.room_id,
    };

    try {
      const response = await makeAjax(url.ARCADE_API.launchGame, reqData, url.ARCADE_MS_EXT);
      if (response.status === "SUCCESS") {
        setIframeUrl(response.data);
        setShowIframe(true);
      } else if (response.status === "ERROR") {
        showMessage(t(response.code), 'error', 'Error');
        return;
      } else {
        console.error("Failed to fetch game URL");
      }
    } catch (error) {
      console.error("Error launching game:", error);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    arrows: false,
    centerMode: true,
    centerPadding: "20px",
    slidesToShow: 5,
    infinite: true,
    autoplay: autoplay,
    autoplaySpeed: 2000,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "60px",
        },
      },
    ],
  };

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

  const keywordAliasMap = {
    mine: "goldrush",
    plinko: "pyramidplinko",
    flip: "coinflip",
  };


  const gamesWithImages = gameList
    .filter(game => gameImageMap[game.game_name.toLowerCase().replace(/\s+/g, '')])
    .map(game => ({
      ...game,
      image: gameImageMap[game.game_name.toLowerCase().replace(/\s+/g, '')],
    }));
    
    useEffect(() => {
    const matchIndex = getBestMatchingGameIndex(gamesWithImages, searchText, keywordAliasMap);
    if (matchIndex !== -1) {
      
      setAutoplay(false);
      sliderRef.current?.slickGoTo(matchIndex);
    }
  }, [searchText, gamesWithImages]);

  return (
    <div className="slider-container">
      <Slider ref={sliderRef} {...settings}>
        {gamesWithImages.map((game, index) => (
          <div
            key={index}
            className={`slide-item ${index === currentSlide
              ? "center"
              : (index === currentSlide - 1 || index === currentSlide + 1)
                ? "side"
                : "outer"
              }`}
          >
            <img src={game.image} alt={game.game_code + game.game_id} onClick={() => handleLaunchGame(game)} />
            {/* <h1 style={{ color: '#fff' }}>{game.game_name}</h1> */}
          </div>
        ))}
      </Slider>

      {showIframe && (
        <IframeLauncher
          gameUrl={iframeUrl}
          onClose={handleCloseIframe}
        />
      )}
    </div>
  );
}

export default withTranslation()(SliderInner);
