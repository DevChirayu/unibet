import React, { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useDispatch } from "react-redux";
import { dataEntryPerPage, setPaginationData } from "../../redux/actions";
import arrows from "../../../src/assets/images/mo_icon/mo_arrow_left.svg";
import { useNavigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Tabs from "../Tabs/Tabs";
import { HiInformationCircle } from "react-icons/hi";
import TransactionMobile from "./TransactionMobile";


const InformationMobilePopup = (props) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { onClose } = props;

  const [perPage, setPerPage] = useState(10);
  const [resetPage, setResetPage] = useState(false);
  const [tabId, setTabId] = useState("transaction");

  const TabList = [
    {
      title: (props.t("transaction")),
      id: "transaction",
    },
    // {
    //   title:(props.t("member_list")),
    //   id: "member-list",
    // },
    // {
    //   title: (props.t("bonus_referral")),
    //   id: "referral-bonus",
    // },
    // {
    //   title: (props.t("info_turnover")),
    //   id: "turnover-info",
    // },
    // {
    //   title: (props.t("bonus_event")),
    //   id: "event-bonus",
    // },
  ];

  const handlePageNo = () => {
    setPerPage(10)
    setResetPage(true);
  };

  const handleResetPageNo = () => {
    setResetPage(false);
  };

  const handlePerRowsChange = (e) => {
    const perPageValue = e.target.value;
    setPerPage(perPageValue);
    setResetPage(true);
  };

  const handleBothFunctions = () => {
    onClose();
  };

  useEffect(() => {
    dispatch(dataEntryPerPage(perPage))
  }, [perPage])


  useEffect(() => {
    setPerPage(10);
    dispatch(setPaginationData(tabId));
  }, [tabId]);




  return (
    <>
      <div className="mo_information" onClick={handleBothFunctions}>
        <div className="inner_content">
          <div className="table content_wrapper">
            <div className="mo_pages_topbar">
              <div className="back_arrow"
                onClick={handleBothFunctions}
              >
                <img src={arrows} alt="arrows"></img>
              </div>
              <div className="mo_page_heading">
                <HiInformationCircle />
                <h2>{props.t("information")}</h2>
              </div>
            </div>
            {/* table start  */}

            <div className="inner_container">
              <Tabs list={TabList} tabId={tabId} setTabId={setTabId} />
              <select
                className="op_number ui searchs dropdown"
                onChange={handlePerRowsChange}
                value={perPage}
              >
                <option value={10}>{10}</option>
                <option value={25}>{25}</option>
                <option value={50}>{50}</option>
                <option value={100}>{100}</option>
              </select>

            </div>
            {tabId === "transaction" ? (
              <TransactionMobile handlePageNo={handlePageNo} />
            ) : (
              ""
            )}

            {/* {tabId === "member-list" ? <MemberListMo /> : ""}
              {tabId === "referral-bonus" && <ReferralBonusMo />}
              {tabId === "turnover-info" ? <TurnOverInfoMo /> : ""}
              {tabId === "event-bonus" ? <EventbonusMo /> : ""} */}

            {/* table end  */}
          </div>
          <Pagination resetPage={resetPage} handleResetPageNo={handleResetPageNo} />
        </div>
      </div>
    </>
  )
}

export default withTranslation()(InformationMobilePopup)