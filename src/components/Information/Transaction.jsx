import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withTranslation } from 'react-i18next';

import {
    makeAjax,
    respStatus,
    showMessage,
    url
} from '../../helpers/global_helper';
import Modal from "../../../src/components/Modal/InnerPopup";
// import WinPopup from "./WinPopup";
import { setTotalNoResult } from '../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import CalendarIcon from "../../assets/images/icons/calendar_icon.svg";
import { formatPrice } from '../NumberFormat';
import BetPopup from "./BetPopup/BetPopup";
import WinPopup from "./WinPoup/WinPopup";
// import JackpotPopup from "./JackpotPopup";

const Transaction = (props) => {

    const dispatch = useDispatch()

    const pageNumber = useSelector((state) => state.paginationData.pageNumber)
    const perPage = useSelector((state) => state.paginationData.dataInOnePage)

    const [startDate, setStartDate] = useState(new Date());
    const [gameName, setGameName] = useState([]);
    const [transectionData, setTransectionData] = useState([]);
    const [selectGameName, setSelectGameName] = useState("0");
    const [showBetPopup, setBetShowPopup] = useState(false);
    const [winPopup, setWinPopup] = useState(false);
    const [detailPopup, setDetailPopup] = useState(false);
    const [status, setStatus] = useState("");
    const [betType, setBetType] = useState("");
    const [newDate, setNewDate] = useState("");
    const [gameId, setGameId] = useState("");
    const [game, setGame] = useState("");
    const [limitId, setLimitId] = useState("");
    const [period, setPeriod] = useState("");
    const [transectionId, setTransectionId] = useState("");
    const [loading, setLoading] = useState(false)
    const [jackpotPopup, setJackpotPopup] = useState('')
    const [nickname, setNickname] = useState();
    const [jackpotAmount, setJackpotAmount] = useState('')

    const date = new Date(startDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because it's zero-indexed
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
        setWinPopup(true);
        setTransectionId(transId);
        setStatus(status);
        setBetType(bettype);
        setGameId(gameId);
        setGame(game);
        setNewDate(date);
        setLimitId(limitId);
        setPeriod(period);
    };

    const handleJackpotOpen = (gameId, nickname, amount, game) => {
        setJackpotPopup(true);
        setGameId(gameId);
        setNickname(nickname);
        setJackpotAmount(amount);
        setGame(game);

    }

    const featchTransectionList = () => {
        setLoading(true)
        let reqData = {
            type: "history_results",
            page: pageNumber,
            date: formattedDate,
            endDate: formattedDate,
            game_id: parseInt(selectGameName),
            length: perPage,
        };
        makeAjax(url.PLAYER_API.listTransaction, reqData, url.PLAYER_MS_EXT).then((response) => {
            if (response.status != respStatus["SUCCESS"]) {
                if (response.code != "validation_error") {
                    showMessage(response);
                    return;
                }
                showMessage(response);
                return;
            }
            setTransectionData(response.data.dataHistory);
            dispatch(setTotalNoResult(response.data.allHistory.total))
            setLoading(false)
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
        const container = document.querySelector('.table_container');
        if (container) {
            container.scrollTop = 0;
        }
        props.handlePageNo();

        featchTransectionList();
    };

    const startIndex = (pageNumber - 1) * perPage;
    return (
        <div className="trasaction_popup">
            <div className="trasaction_top_bar">
                <div className="calendar">
                    <DatePicker
                        // showIcon
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
                            gameName?.map(({ game_id, game_name }) => (
                                <option key={game_id} value={game_id}>
                                    {game_name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="search">
                    <button onClick={handleSearchData} >{props.t("search")}</button>
                </div>
            </div>
            <div className="table_container" >
                <table className="table_data" border="0">
                    <thead>
                        <tr>
                            <th>{props.t("no.")}</th>
                            <th>{props.t("history")} ID</th>
                            <th>{props.t("date")}</th>
                            <th>{props.t("game")}</th>
                            <th>{props.t("period")}</th>
                            <th>{props.t("status")}</th>
                            <th>{props.t("credit")}</th>
                            <th>{props.t("debit")}</th>
                            <th>{props.t("coin")}</th>
                            <th>{props.t("balance")}</th>
                            <th>{props.t("coin_reward")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading &&
                            (transectionData.length == 0 ?
                                <tr className="table_data_empty_row">
                                    <td colSpan="11">{props.t("data_not_found")}</td>
                                </tr>

                                :
                                transectionData.map((value, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "first_bg" : "second_bg"}
                                    >
                                        <td>{startIndex + index + 1}</td>
                                        <td>{value.id}</td>
                                        <td>{value.datetime}</td>
                                        <td>{value.game_name}</td>
                                        <td>{value.game_id == 0 ? 0 : value.periode}</td>
                                        <td>{
                                            value.status === 21 ? <span className="link" onClick={() => handleBetOpen(value.trans_id, value.status, value.bettype, value.game_id, value.game_name, value.datetime, value.limit_id, value.period)}>{props.t("bet")}</span>
                                                : value.status === 22 ? <span className="link" onClick={() => handleWinOpen(value.trans_id, value.status, value.bettype, value.game_id, value.game_name, value.datetime, value.limit_id, value.period)}>{props.t('win')}</span>
                                                    : value.status === 30 ? <span className="link" onClick={() => handleJackpotOpen(value.game_id, value.nickname, value.amount, value.game_name)}>{props.t("tablejackpot")}</span>
                                                        : props.t(`action${value.act}`)}
                                        </td>
                                        <td>{formatPrice(value.credit)}</td>
                                        <td>{formatPrice(value.debit)}</td>
                                        <td>{formatPrice(value.coin)}</td>
                                        <td>{formatPrice(value.balance)}</td>
                                        <td>{formatPrice(value.reward_balance)}</td>
                                    </tr>
                                )))
                        }
                    </tbody>
                </table>
            </div>
            {

                showBetPopup && (
                    <Modal
                        modalTitle={`${props.t("bet")} ${game}`}
                        modalHeader={true}
                        onCloseModal={() => setBetShowPopup(false)}
                    >
                        <BetPopup
                            transId={transectionId}
                            status={status}
                            bettype={betType}
                            gameId={gameId}
                            date={newDate}
                            limitId={limitId}
                            period={period}
                            game={game} />
                    </Modal>

                )


            }
            {
                winPopup && <Modal modalTitle={`${props.t("win")} ${game}`} modalHeader={true} onCloseModal={() => setWinPopup(false)}>
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
                </Modal >
            }
            {/* {
                jackpotPopup && <Modal modalTitle={"JACKPOT"} modalHeader={true} onCloseModal={() => setJackpotPopup(false)}>
                    <JackpotPopup

                        nickname={nickname}
                        amount={jackpotAmount}
                        game={game}
                    />
                </Modal >
            } */}
            {/* {
                
                detailPopup && (
                    <Modal
                        modalTitle="DETAIL"
                        modalHeader={true}
                        onCloseModal={() => setDetailPopup(false)}
                    >
                        <div className="poupup_detail_table">
                            <div className="poupup_detail_table_row">
                                <div className="poupup_detail_table_title">History ID</div>
                                <div className="poupup_detail_table_desc">3394306</div>
                            </div>
                            <div className="poupup_detail_table_row">
                                <div className="poupup_detail_table_title">Game</div>
                                <br />
                                <div className="poupup_detail_table_desc">
                                    Dingdong Super Wheel STANDARD
                                </div>
                            </div>
                            <div className="poupup_detail_table_row">
                                <div className="poupup_detail_table_title">Period</div>
                                <div className="poupup_detail_table_desc">1736 - Limit 2</div>
                            </div>
                            <div className="poupup_detail_table_row">
                                <div className="poupup_detail_table_title">Status</div>
                                <div className="poupup_detail_table_desc">Bet</div>
                            </div>
                            <div className="poupup_detail_table_row">
                                <div className="poupup_detail_table_title">Credit</div>
                                <div className="poupup_detail_table_desc">0.00</div>
                            </div>
                            <div className="poupup_detail_table_row">
                                <div className="poupup_detail_table_title">Debit</div>
                                <div className="poupup_detail_table_desc">0.00</div>
                            </div>
                        </div>
                    </Modal>
                )
            } */}
        </div>
    )
}

export default withTranslation()(Transaction)