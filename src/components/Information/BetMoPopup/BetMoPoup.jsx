import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { makeAjax, respStatus,
  showMessage,
  url, } from "../../../helpers/global_helper";
import { formatPrice } from "../../NumberFormat";

const BetMoPoup = (props) => {

    const { status, bettype, date, gameId, limitId, period, transId, game } = props;
  const [transectionDetailData, setTransactionDetailsData] = useState([]);
  const [gameCode, setGameCode] = useState("");
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalBuyers1, setTotalBuyers1] = useState(0);

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

      if (res.data && res.data.result) {
        res.data.result["Total Prize"] = "0.00";
      }

      setTransactionDetailsData(res.data.result); 
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
return (
    <div className="poupup_detail_table">
      {Object.entries(transectionDetailData).map(([key, value], idx) => (
        <div key={idx} className="poupup_detail_table_row">
          <div className="poupup_detail_table_title">{props.t(key)}</div>
          <div className="poupup_detail_table_desc">
            {Array.isArray(value) ? (
              // Handle nested array
              value.map((item, subIdx) => (
                <div key={subIdx} style={{ marginBottom: 10, paddingLeft: 10 }}>
                  {Object.entries(item).map(([subKey, subVal], i) => (
                    <div key={i} className="poupup_detail_table_row">
                      <div className="poupup_detail_table_title">{props.t(subKey)}</div>
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

export default withTranslation()(BetMoPoup)