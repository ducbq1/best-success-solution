import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import TableLogs from "./TableLogs";

export default function Logs(props) {
    const perPage = 8;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(0);
    const [offset, setOffset] = useState(0);
    const [filterData, setFilterData] = useState('');

    const handleChange = (event) => {
        let queryValue = event.target.value;
        setOffset(0);
        setFilterData(queryValue);
    }

    const handleClick = (event) => {
        const index = event.target.name;
        console.log(index);
        setOffset(index);
    }

    useEffect(() => {
        fetch(props.url, { method: 'get' })
            .then(res => res.json())
            .then(result => {
                setIsLoaded(true);
                // setItems(result.slice(offset * perPage, offset * perPage + perPage).filter(item => item.name.toUpperCase().indexOf(filterData.toUpperCase()) > -1));
                let filterResult = result.filter(item => item.name.toUpperCase().indexOf(filterData.toUpperCase()) > -1);
                let filterPagination = Math.ceil(filterResult.length / perPage);
                setPagination(filterPagination);
                setItems(filterResult.slice(offset * perPage, offset * perPage + perPage));
            },
                error => {
                    setIsLoaded(true);
                    setError(error);
                })
    }, [offset, filterData, props.url]);

    const indents = [];
    for (let i = 0; i < pagination; i++) {
        indents.push(<a href="#" key={i + 1} name={i} onClick={handleClick}>{i + 1}</a>);
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div>
                <div className="search">
                    <h1>Action Logs</h1>
                    <div>
                        <FontAwesomeIcon icon={faSearch} />&nbsp;&nbsp;
                        <input onChange={handleChange} className="" type="search" name="" id="search" placeholder="Search..." />
                    </div>
                </div>
                <TableLogs items={items} />
                <div className="pagination">
                    {indents}
                </div>
            </div>

        );
    }
}