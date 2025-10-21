import closeIcon from "../../../src/assets/images/icons/close_icon.svg";
function InnerPopup({ onCloseModal, closeButton = true, modalHeader = false, modalTitle = "message", children }) {
    const showModal = true
    const handleModalClose = () => {
        onCloseModal()
    }
    const handleOverlayClick = (event) => {
        event.stopPropagation(); // Stop propagation to prevent clicks outside the modal
        onCloseModal()
    };




    const language = localStorage.getItem("I18N_LANGUAGE");

    const translateTitle = (title) => {
        let parts = title.split(" ");
        let Firstline = parts[0];
        let Secondline = parts.slice(1).join(" ");

        if (language === "id") {
            if (Firstline === "WIN") Firstline = "Menang";
            if (Firstline === "BET") Firstline = "Taruhan";
        } else if (language === "en") {
            if (Firstline === "WIN") Firstline = "Win";
            if (Firstline === "BET") Firstline = "Bet";
        }
        return `${Firstline} ${Secondline}`;
    };

    const translatedTitle = translateTitle(modalTitle);
    const [Firstline, ...rest] = translatedTitle.split(" ");
    const Secondline = rest.join(" ");

    const isSpecialTitle = ["Menang", "Taruhan", "Win", "Bet"].includes(Firstline);
    return (
        <>
            {
                showModal &&
                <>
                    <div className="modal_overlay" onClick={handleOverlayClick}> </div>
                    <div className="modal">
                        {modalHeader && (
                            <div className="modal_header">
                                {modalTitle && isSpecialTitle ? (
                                    <>
                                        {Firstline} <br /> {Secondline}
                                    </>
                                ) : (
                                    <div className="modal_header">{modalTitle}</div>
                                )}
                                {modalTitle && <div className="header_bottom_border"></div>}
                            </div>
                        )}
                        {
                            closeButton ? <div className="modal_close" onClick={handleModalClose}>
                                <img src={closeIcon} alt="" />
                                </div> : ""
                        }

                        <div className="modal_body">
                            {children}
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default InnerPopup