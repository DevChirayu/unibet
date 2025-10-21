// import closeIcon from "../../../src/assets/images/modal/close.svg";


const Modal = ({ onCloseModal, closeButton = true, modalHeader = false, modalTitle = "message", children }) => {
    const showModal = true
    const handleModalClose = () => {
        onCloseModal()
    }
    return (
        <>
            {
                showModal &&
                <div className="modal">
                    {
                        modalHeader && (<div className="modal_header">
                            {modalTitle ? <p>{modalTitle}</p> : ""}
                            {modalTitle ? <div className="header_bottom_border"></div> : ""}
                        </div>)
                    }
                    {
                        closeButton ? <div className="modal_close" onClick={handleModalClose}><img alt="" /></div> : ""
                    }

                    <div className="modal_body">
                        {children}
                    </div>
                </div>
            }
        </>

    )
}

export default Modal;