import React, { useEffect, useState } from "react";
// import MemberList from "../HeaderRightMenu/InforSubComponent/MemberList";
// import ReferralBonus from "../HeaderRightMenu/InforSubComponent/ReferralBonus";
// import TurnoverInfo from "../HeaderRightMenu/InforSubComponent/TurnoverInfo";
// import EventBonus from "../HeaderRightMenu/InforSubComponent/EventBonus";
import CloseIcon from "../../assets/images/icons/close_icon.svg"
import { useDispatch } from 'react-redux';
import { dataEntryPerPage, setPaginationData } from "../../redux/actions";
import { withTranslation } from "react-i18next";
import Pagination from '../Pagination/Pagination'
import Transaction from "./Transaction";
import { HiInformationCircle } from "react-icons/hi";

const InformationPopup = (props) => {
    const { onClose } = props;
    const dispatch = useDispatch()
    const [selectedTab, setSelectedTab] = useState("Transaction");
    const [perPage, setPerPage] = useState(10);
    // const [searching, setSearching] = useState(false);

    const [resetPage, setResetPage] = useState(false);

    const handlePageNo = () => {
        setResetPage(true);
        window.scrollTo(0, 0)
    };

    const handleResetPageNo = () => {
        setResetPage(false);
    };


    const handlePerRowsChange = (e) => {
        const perPageValue = e.target.value;
        setPerPage(perPageValue);
        setResetPage(true);
    };


    useEffect(() => {
        setPerPage(10);
    }, [selectedTab]);

    dispatch(dataEntryPerPage(perPage))


    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
        dispatch(setPaginationData(tabName))
    };


    // Function to reset page number


    const renderComponent = () => {
        switch (selectedTab) {
            case "Transaction":
                return <Transaction handlePageNo={handlePageNo} />;
            //   case "MemberList":
            //     return <MemberList />;
            //   case "ReferralBonus":
            //     return <ReferralBonus />;
            //   case "TurnoverInfo":
            //     return <TurnoverInfo />;
            //   case "EventBonus":
            //     return <EventBonus />;
            //   default:
            //     return null;
        }
    };

    const handleBothFunctions = () => {
        onClose();
        setResetPage(true);
    };
    return (
        <div className="information-container">

            <div className="information-inner">
                <div className="information-overlay" onClick={handleBothFunctions}></div>
                <div className="information">
                    <div className="information-text">
                        <HiInformationCircle />
                        <h2>{props.t("information")}</h2>
                    </div>

                    <a className="close_info" onClick={handleBothFunctions}><img src={CloseIcon} alt="" /></a>
                    <div className="tabs_select_row">
                        <div className="tabs">
                            <button
                                className={selectedTab === "Transaction" ? "tab active" : "tab"}
                                onClick={() => handleTabClick("Transaction")}
                            >
                                {props.t("transaction")}
                            </button>
                            {/* <button
                className={selectedTab === "MemberList" ? "tab active" : "tab"}
                onClick={() => handleTabClick("MemberList")}
              >
                {props.t("member_list")}
              </button>
              <button
                className={selectedTab === "ReferralBonus" ? "tab active" : "tab"}
                onClick={() => handleTabClick("ReferralBonus")}
              >
                {props.t("bonus_referral")}
              </button>
              <button
                className={selectedTab === "TurnoverInfo" ? "tab active" : "tab"}
                onClick={() => handleTabClick("TurnoverInfo")}
              >
                {props.t("info_turnover")}
              </button>
              <button
                className={selectedTab === "EventBonus" ? "tab active" : "tab"}
                onClick={() => handleTabClick("EventBonus")}
              >
                {props.t("bonus_event")}
              </button> */}
                        </div>
                        <select className="ui search dropdown" onChange={handlePerRowsChange} value={perPage}>
                            <option value={10}>{10}</option>
                            <option value={25}>{25}</option>
                            <option value={50}>{50}</option>
                            <option value={100}>{100}</option>
                        </select>
                    </div>
                    <div>{renderComponent()}</div>
                    <Pagination resetPage={resetPage} handleResetPageNo={handleResetPageNo} />
                </div>
            </div>
        </div >
    )
}

export default withTranslation()(InformationPopup)