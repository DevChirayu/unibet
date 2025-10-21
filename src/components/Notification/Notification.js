import React, { useEffect, useState } from "react";
import NotifiResultPopup from "./NotifiResultPopup";
// import { withTranslation } from "react-i18next";
import {
    formatDate,
    makeAjax,
    respStatus,
    showMessage,
    url,
} from "../../helpers/global_helper";
import { useDispatch } from "react-redux";

import InfiniteScroll from "react-infinite-scroll-component";
import CloseIcon from "../../assets/img/icons/close_icon.svg";
import NotificationIcon from "../../assets/img/icons/notificationIcon.png";
import { getUserBalance } from "../../redux/actions";
import { withTranslation } from "react-i18next";
const Notification = (props) => {
    console.log(props)
    const { onClose } = props;
    const dispatch = useDispatch();
    // const { onClose } = props;
     const [isResultPopup, setIsResultPopup] = useState(false);
     const [notificationId, setNotificationId] = useState(null);
     const [notificationSubject, setNotificationSubject] = useState(null);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const openNotificationResultPopup = (index, notificationId, notificationSubject) => {
        let t = [...items];
        t[index].isNew = 0;
        setItems([...t]);
        setNotificationId(notificationId);
        setNotificationSubject(notificationSubject)
        setIsResultPopup(true);
    };
    const closeNotificationResultPopup = () => {
        setIsResultPopup(false);
    };
    // // api for Notification list
    const fetchNotificationData = () => {
        let reqData = {
            page: page,
        };
        makeAjax(url.PLAYER_API.listNotification, reqData, url.PLAYER_MS_EXT).then((response) => {
            if (response.status != respStatus["SUCCESS"]) {
                if (response.code != "validation_error") {
                    showMessage("server error No data find", "error", "error");
                    return;
                }
                showMessage("server error No data find", "error", "error");
                return;
            }
            const newData = response.data.notifResults.data; // Assuming your API returns an array of items
            setItems((prevItems) => [...prevItems, ...newData]);
            setPage((prevPage) => prevPage + 1);
            setHasMore(newData.length > 0);
            dispatch(getUserBalance());
        });
    };
    useEffect(() => {
        fetchNotificationData();
    }, []);
    return (
        <>
            <div className="notification-container">
                <div className="notification-inner">
                    <div className="notification-overlay"></div>
                    <div className="notification">
                        <div className="notification-heading">
                            <img src={NotificationIcon} className="notificationIcon" />
                            <h2>Notification</h2>
                        </div>
                        <div className="close_info" onClick={onClose}>
                            <img src={CloseIcon} alt="" />
                        </div>

                        <div className="table_container overflow-y-scroll">
                            {/* <InfiniteScroll
                                dataLength={items.length}
                                next={() => fetchNotificationData()}
                                pullDownToRefreshThreshold={50}
                                hasMore={hasMore}
                                // loader={<h4 className="ladtext">Loading...</h4>}
                                endMessage={<p>{props.t("no_more_items_to_load")}</p>}
                                scrollThreshold={0.7}
                                height={"60vh"}
                            > */}
                            <table className="table_data" width="100%">
                                <thead>
                                    <tr>
                                        <th> {props.t("no.")}</th>
                                        <th> {props.t("subject")}</th>
                                        <th> {props.t("date")}</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {items &&
                                        items.map((notification, index) => {
                                            return (
                                                <tr
                                                    key={index}

                                                >
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="notification_row_content">
                                                            <a
                                                                onClick={() =>
                                                                    openNotificationResultPopup(index, notification.id, notification.subject)
                                                                }
                                                                className={notification.isNew ? "notification-link new" : "notification-link"}
                                                            >
                                                                {notification.subject}
                                                                <span style={{ color: "#00ffdc", fontWeight: "600", textDecoration: "none" }}>
                                                                    {notification.isNew ? "New" : ""}
                                                                </span>
                                                            </a>


                                                        </div>
                                                    </td>
                                                    <td>{formatDate(notification.date)}</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                            {/* </InfiniteScroll> */}
                        </div>
                    </div>
                    {isResultPopup && (
                            <NotifiResultPopup
                                onClose={closeNotificationResultPopup}
                                notificationId={notificationId}
                                notificationSubject={notificationSubject}
                            />
                        )}
                </div>
            </div>

        </>
    )
}

export default withTranslation()(Notification);
