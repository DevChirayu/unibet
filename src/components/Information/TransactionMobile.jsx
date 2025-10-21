import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withTranslation } from "react-i18next";
import CalendarIcon from "../../../src/assets/images/icons/calendar_icon.svg";
import { makeAjax,
    respStatus,
    showMessage,
    url, } from "../../helpers/global_helper";

import { setTotalNoResult } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "../NumberFormat";
import Modal from "../../../src/components/Modal/InnerPopup";
import DetailMoPopup from "./DetailsMoPopup/DetailMoPopup";
import WinPopup from "./WinPoup/WinPopup";
import BetPoup from "./BetPopup/BetPopup";

const TransactionMobile = (props) => {
    const { handlePageNo } = props;
    const dispatch = useDispatch();

    const pageNumber = useSelector((state) => state.paginationData.pageNumber);
    const perPage = useSelector((state) => state.paginationData.dataInOnePage);
    const [getAct, setGetAct] = useState('')
    const [startDate, setStartDate] = useState(new Date());
    const [gameName, setGameName] = useState([]);
    const [transectionData, setTransectionData] = useState([]);
    const [selectGameName, setSelectGameName] = useState("0");
    const [showBetPopup, setBetShowPopup] = useState(false);
    const [showWinPopup, setWinShowPopup] = useState(false);
    const [detailsMoPopup, setdetailsMoPopup] = useState(false);
    const [status, setStatus] = useState("");
    const [betType, setBetType] = useState("");
    const [newDate, setNewDate] = useState("");
    const [gameId, setGameId] = useState("");
    const [game, setGame] = useState("");
    const [limitId, setLimitId] = useState("");
    const [period, setPeriod] = useState("");
    const [transectionId, setTransectionId] = useState("");
    const [historyId, setHistoryId] = useState("")
    const [datetime, setDatetime] = useState("")
    const [game_name, setGame_name] = useState("")
    const [credit, setCredit] = useState("")
    const [debit, setDebit] = useState("")
    const [coin, setCoin] = useState("")
    const [balance, setBalance] = useState("")
    const [jackpotPopup, setJackpotPopup] = useState('')
    const [nickname, setNickname] = useState();
    const [jackpotAmount, setJackpotAmount] = useState('')

    const date = new Date(startDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;


    const CustomInput = ({ value, onClick }) => (
        <div style={{ position: "relative" }} className="custom_calendar">
            <input
                type="text"
                value={value}
                onClick={onClick} // This opens the calendar on input click
                readOnly // Prevent direct text input
            />
            <button
                onClick={onClick} // This also opens the calendar on icon click

                style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                }}
            >
                <img src={CalendarIcon} alt="" />
            </button>
        </div>
    );

    // api for Game list
        const featchGameList = () => {
            makeAjax(url.ARCADE_API.gameList).then((response) => {
                if (response.status != respStatus["SUCCESS"]) {
                    if (response.code != "validation_error") {
                        showMessage(response);
                        return;
                    }
                    showMessage(response);
                    return;
                }
                setGameName(response.data);
            });
        };
    
        useEffect(() => {
            featchGameList();
        }, []);


    const handleGameSelectOptions = (e) => {
        const selectedValue = e.target.value;
        setSelectGameName(selectedValue);
    };

    const handleBetOpen = (
        transId,
        status,
        bettype,
        gameId,
        game,
        date,
        limitId,
        period
    ) => {

        setBetShowPopup(true);
        setTransectionId(transId);
        setStatus(status);
        setBetType(bettype);
        setGameId(gameId);
        setGame(game);
        setNewDate(date);
        setLimitId(limitId);
        setPeriod(period);
    };

    const handleWinOpen = (
        transId,
        status,
        bettype,
        gameId,
        game,
        date,
        limitId,
        period
    ) => {

        setWinShowPopup(true);
        setTransectionId(transId);
        setStatus(status);
        setBetType(bettype);
        setGameId(gameId);
        setGame(game);
        setNewDate(date);
        setLimitId(limitId);
        setPeriod(period);
    };


    const handleDetailsOpen = (
        historyId,
        datetime,
        game_name,
        period,
        status,
        credit,
        debit,
        coin,
        balance,
        act
    ) => {
        setGetAct(act);
        setdetailsMoPopup(true);
        setHistoryId(historyId);
        setDatetime(datetime);
        setGame_name(game_name);
        setPeriod(period);
        setStatus(status);
        setCredit(credit);
        setDebit(debit);
        setCoin(coin)
        setBalance(balance)
        document.body.style.overflow = 'hidden';

    };
    const handleJackpotOpen = (gameId, nickname, amount, game) => {
        setJackpotPopup(true);
        setGameId(gameId);
        setNickname(nickname);
        setJackpotAmount(amount);
        setGame(game);

    }
    const featchTransectionList = () => {

        let reqData = {
            type: "history_results",
            page: pageNumber,
            date: formattedDate,
            endDate: formattedDate,
            game_id: parseInt(selectGameName),
            length: perPage,
        };
        makeAjax(url.PLAYER_API.listTransaction, reqData, url.PLAYER_MS_EXT).then((response) => {
            if (response.status !== respStatus["SUCCESS"]) {
                if (response.code !== "validation_error") {
                    showMessage(response);
                    return;
                }
                showMessage(response);
                return;
            }
            setTransectionData(response.data.dataHistory);

            dispatch(setTotalNoResult(response.data.allHistory.total));

        });
    };

    useEffect(() => {
        featchTransectionList();
        const container = document.querySelector('.table_container');
        if (container) {
            container.scrollTop = 0;
        }
    }, [perPage, pageNumber]);


    const handleSearchData = () => {
        handlePageNo();
        featchTransectionList();
    };

  return (
    <div className="trasaction_popup">
            <div className="trasaction_top_bar">
                <div className="calendar">
                    <DatePicker
                        customInput={<CustomInput />}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                    />
                </div>
                <div className="all_game_dropdown">
                    <select className="ui search dropdown" onChange={handleGameSelectOptions}>
                        <option value="0">{props.t("all")}</option>
                        {gameName.length > 0 &&
                            gameName.map(({ game_id, game_name }) => (
                                <option key={game_id} value={game_id}>
                                    {game_name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="search">
                    <button onClick={handleSearchData}>{props.t("search")}</button>
                </div>
            </div>
            <div className="table_container">
                <table className="table_data" border="0">
                    <thead>
                        <tr>
                            <th>{props.t("date")}</th>
                            <th>{props.t("game")}</th>
                            <th>{props.t("period")}</th>
                            <th>{props.t("status")}</th>
                            <th>{props.t("balance")}</th>
                            <th>
                                {/* {props.t("description")} */}
                                desc
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transectionData.length === 0 ? (
                            <tr className="table_data_empty_row">
                                <td colSpan="11">{props.t("data_not_found")}</td>
                            </tr>
                        ) : (
                            transectionData.map((value, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "first_bg" : "second_bg"}
                                >
                                    <td>{value.datetime}</td>
                                    <td>{value.game_name}</td>
                                    {/* <td>{value.periode}</td> */}
                                    <td>{value.game_id == 0 ? 0 : value.periode}</td>

                                    <td>
                                        {/* {value.status === 21 ? <span className="link" onClick={() => handleBetOpen(value.trans_id, value.status, value.bettype, value.game_id, value.game_name, value.datetime, value.limit_id, value.period)}>{props.t("bet")}</span> 
                                    : value.status === 22 ? <span className="link" onClick={() => handleWinOpen(value.trans_id, value.status, value.bettype, value.game_id, value.game_name, value.datetime, value.limit_id, value.period)}>{props.t("win")}</span> 
                                    : value.status === 30 ? <span className="link" onClick={() => handleJackpotOpen(value.game_id,value.nickname,value.amount,value.game_name)}>{props.t("tablejackpot")}</span>
                                    : '-'} */}
                                        {
                                            value.status === 21 ? <span className="link" onClick={() => handleBetOpen(value.trans_id, value.status, value.bettype, value.game_id, value.game_name, value.datetime, value.limit_id, value.period)}>{props.t("bet")}</span>
                                                : value.status === 22 ? <span className="link" onClick={() => handleWinOpen(value.trans_id, value.status, value.bettype, value.game_id, value.game_name, value.datetime, value.limit_id, value.period)}>{props.t('win')}</span>
                                                    : value.status === 30 ? <span className="link" onClick={() => handleJackpotOpen(value.game_id, value.nickname, value.amount, value.game_name)}>{props.t("tablejackpot")}</span>
                                                        : props.t(`action${value.act}`)}
                                    </td>
                                    <td>{formatPrice(value.balance)}</td>
                                    <td><span className="link" onClick={() => handleDetailsOpen(value.id, value.datetime, value.game_name, value.period, value.status, value.credit, value.debit, value.coin, value.balance, value.act)}>Details</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {showBetPopup && (
                <Modal
                    modalTitle={`${props.t("bet")} ${game}`}
                    modalHeader={true}
                    onCloseModal={() => setBetShowPopup(false)}
                >
                    <BetPoup
                        transId={transectionId}
                        status={status}
                        bettype={betType}
                        gameId={gameId}
                        date={newDate}
                        limitId={limitId}
                        period={period}
                        game={game}
                    />
                </Modal>
            )}
            {showWinPopup && (
                <Modal modalTitle={`${props.t("win")} ${game}`} modalHeader={true} onCloseModal={() => setWinShowPopup(false)}>
                    <WinPopup
                        transId={transectionId}
                        act={status}
                        bettype={betType}
                        gameId={gameId}
                        date={newDate}
                        limitId={limitId}
                        period={period}
                        game={game}
                    />
                </Modal>
            )}
            {/* {
                jackpotPopup && <Modal modalTitle={"JACKPOT"} modalHeader={true} onCloseModal={() => setJackpotPopup(false)}>
                    <JackpotMoPopup

                        nickname={nickname}
                        amount={jackpotAmount}
                        game={game}
                    />
                </Modal >
            } */}
            {detailsMoPopup && (
                <Modal
                    modalTitle={props.t("detail")}
                    modalHeader={true}
                    onCloseModal={() => setdetailsMoPopup(false)}
                >
                    <DetailMoPopup
                        historyId={historyId}
                        datetime={datetime}
                        game_name={game_name}
                        period={period}
                        status={status}
                        credit={credit}
                        debit={debit}
                        coin={coin}
                        balance={balance}
                        act={getAct}
                    />
                </Modal>
            )}
        </div>
  )
}

export default withTranslation()(TransactionMobile)