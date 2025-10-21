import React from 'react'
import { withTranslation } from "react-i18next";
import { formatPrice } from "../../NumberFormat";

const DetailMoPopup = (props) => {
    const { historyId,
        datetime,
        game_name,
        period,
        status,
        credit,
        debit,
        coin,
        balance,
        act
    } = props;
  return (
    <div className="poupup_detail_table">
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("history")} ID</div>
                <div className="poupup_detail_table_desc">{historyId}</div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("date")}</div>
                <div className="poupup_detail_table_desc">{datetime}</div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("game")}</div>
                <div className="poupup_detail_table_desc">
                    {game_name}
                </div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("period")}</div>
                <div className="poupup_detail_table_desc">{period}</div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("status")}</div>
                <div className="poupup_detail_table_desc">{status == "19" ? props.t("action" + status) : status == "21" ? props.t("bet") : status == "22" ? props.t("win") : status == "23" ? props.t("lose") : status == "30" ? props.t("tablejackpot") : act == "6" ? props.t("action6") : ""}</div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("credit")}</div>
                <div className="poupup_detail_table_desc">{formatPrice(credit)}</div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("debit")}</div>
                <div className="poupup_detail_table_desc">{formatPrice(debit)}</div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("coin")}</div>
                <div className="poupup_detail_table_desc">{formatPrice(coin)}</div>
            </div>
            <div className="poupup_detail_table_row">
                <div className="poupup_detail_table_title">{props.t("balance")}</div>
                <div className="poupup_detail_table_desc">{formatPrice(balance)}</div>
            </div>
        </div>
  )
}

export default withTranslation()(DetailMoPopup)