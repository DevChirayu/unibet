import { useEffect, useState } from "react";
import SingleTab from "../SingleTab/SingleTab";

const Tabs = (props) => {

    const { list, setTabId } = props

    const [activeTab, setActiveTab] = useState(props.tabId);

    const handleClick = (id) => {
        setActiveTab(id);
    }

    useEffect(() => {
        setTabId(activeTab);
    }, [activeTab])
    return (
        <>
            <div className="tabs">
                {
                    list.map((tab) => {
                        return <SingleTab key={tab.id} title={tab.title} id={tab.id} activeTab={activeTab} handleClick={handleClick} />;
                    })
                }
            </div>
        </>
    )
}
export default Tabs;