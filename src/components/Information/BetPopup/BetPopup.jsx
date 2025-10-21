import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../../NumberFormat'
import {
    makeAjax,
    respStatus,
    showMessage,
    url,
} from '../../../helpers/global_helper'

const BetPopup = (props) => {
    const { status, bettype, date, gameId, limitId, period, transId, game } = props;
    const [transactionDetailData, setTransactionDetailsData] = useState([]);

    const featchTransectionHistoryDetail = () => {
        let reqData = {
            act: status,
            bettype: bettype,
            date: date,
            game_id: gameId,
            limitid: limitId,
            period: parseInt(period),
            trans_id: transId,

        };
        makeAjax(url.PLAYER_API.getTransaction, reqData, url.PLAYER_MS_EXT).then((response) => {
            if (response.status != respStatus["SUCCESS"]) {
                if (response.code != "validation_error") {
                    showMessage(response);
                    return;
                }
                showMessage(response);
                return;
            }

            setTransactionDetailsData(response.data.result);
        });
    };


    useEffect(() => {
        featchTransectionHistoryDetail();
    }, []);

    return (
        <>
            {transactionDetailData && (
                <div className="poupup_detail_table">
                    <table className="table_data" border="0">
                        <thead>
                            <tr>
                                {Object.keys(transactionDetailData).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {Object.values(transactionDetailData).map((value, index) => (
                                    <td key={index}>
                                        {Array.isArray(value) ? (
                                            <table className="nested_table" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        {Object.keys(value[0] || {}).map((subKey, idx) => (
                                                            <th key={idx}>{subKey}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {value.map((item, subIndex) => (
                                                        <tr key={subIndex}>
                                                            {Object.values(item).map((subVal, valIdx) => (
                                                                <td key={valIdx}>{subVal}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            value?.toString()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

        </>
    )
}

export default withTranslation()(BetPopup)