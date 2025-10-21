import { Link } from "react-router-dom";
const SingleTab = ({ title, id, activeTab, setActiveTab, handleClick }) => {
    const handleTabClick = () => {
        // setActiveTab(id);
        handleClick(id);
    }

    return (
        <>
            <Link to={`#${id}`} >
                <div className={`tab ${activeTab === id ? "active" : ""} `} onClick={handleTabClick} >
                    {title}
                </div>
            </Link>
        </>
    )
}
export default SingleTab;

