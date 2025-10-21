import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  makeAjax,
  respStatus,
  showMessage,
  url,
} from "../../../helpers/global_helper";
import { formatPrice } from "../../NumberFormat";

const WinMoPopup = (props) => {
  const { status, bettype, date, gameId, limitId, period, transId, t } = props;
  const [transactionData, setTransactionData] = useState(null);

  const fetchData = () => {
    const reqData = {
      act: status,
      bettype,
      date,
      game_id: gameId,
      limitid: limitId,
      period: parseInt(period),
      trans_id: transId,
    };

    makeAjax(url.PLAYER_API.getTransaction, reqData, url.PLAYER_MS_EXT).then((res) => {
      if (res.status !== respStatus["SUCCESS"]) {
        showMessage(res);
        return;
      }

      setTransactionData(res.data.result); 
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!transactionData) {
    return (
      <div style={{ fontSize: 13, color: "#fff", textAlign: "center", paddingBottom: 20 }}>
        {t("data_not_found")}
      </div>
    );
  }

  return (
    <div className="poupup_detail_table">
      {Object.entries(transactionData).map(([key, value], idx) => (
        <div key={idx} className="poupup_detail_table_row">
          <div className="poupup_detail_table_title">{t(key)}</div>
          <div className="poupup_detail_table_desc">
            {Array.isArray(value) ? (
              // Handle nested array
              value.map((item, subIdx) => (
                <div key={subIdx} style={{ marginBottom: 10, paddingLeft: 10 }}>
                  {Object.entries(item).map(([subKey, subVal], i) => (
                    <div key={i} className="poupup_detail_table_row">
                      <div className="poupup_detail_table_title">{t(subKey)}</div>
                      <div className="poupup_detail_table_desc">{subVal}</div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              typeof value === "number"
                ? formatPrice(value)
                : value?.toString()
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default withTranslation()(WinMoPopup);
