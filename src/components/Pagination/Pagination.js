import LeftArrow from "../../../src/assets/images/icons/pagi_left_arrow.svg"
import RightArrow from "../../../src/assets/images/icons/pagi_right_arrow.svg";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { pageNumberInfo } from "../../redux/actions";


const Pagination = ({ resetPage, handleResetPageNo }) => {


    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0)
    const tabNameInformation = useSelector((state) => state.paginationData.pagination)
    const itemsPerPage = useSelector((state) => state.paginationData.dataInOnePage)
    const totalNumberOfResult = useSelector((state) => state.paginationData.totalNumberOfResult)

    const totalPagesToShow = 5; // Fixed number of pages to display



    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        if (resetPage) {
            setCurrentPage(1);
            handleResetPageNo();
        }
    }, [resetPage, handleResetPageNo]);


    useEffect(() => {

        setTotalItems(totalNumberOfResult)

    }, [totalNumberOfResult, tabNameInformation, resetPage])


    const goToPreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const firstPageNumber = Math.max(currentPage - Math.floor(totalPagesToShow / 2), 1);
    const lastPageNumber = Math.min(firstPageNumber + totalPagesToShow - 1, totalPages);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = firstPageNumber; i <= lastPageNumber; i++) {
            pageNumbers.push(
                <div key={i} className={`page_number ${currentPage === i ? 'active' : ''}`} onClick={() => setCurrentPage(i)}>
                    {i}
                </div>
            );
        }
        return pageNumbers;
    };



    useEffect(() => {
        setCurrentPage(1)
    }, [tabNameInformation])

    useEffect(() => {
        dispatch(pageNumberInfo(currentPage))
    }, [currentPage])

    return (
        <>

            <div className="pagination">
                {totalItems > 0 ? <div className="left_arrow" onClick={goToPreviousPage}>
                    <img src={LeftArrow} alt="left arrow" style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }} />
                </div> : ""}
                {renderPageNumbers()}
                {totalItems > 0 ? <div className="right_arrow" onClick={goToNextPage}>
                    <img src={RightArrow} alt="right arrow" style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }} />
                </div> : ""}
            </div>
        </>
    );
};

export default Pagination;