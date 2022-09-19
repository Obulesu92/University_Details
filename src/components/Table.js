import React, { useState, useEffect, MenuButton, MenuItem, DropDownMenu, DropdownItem } from 'react';

const Table = () => {

    const [tableData, setTableData] = useState([]);
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("asc");
    const [selectedCountryData, setSelectedCountryData] = useState([]);
    const [countresList,setCountriesList]=useState([]);
    const [selectedOption, setSelectedOption] = useState();

    useEffect(() => {
        fetch('http://universities.hipolabs.com/search?country=United+States')
            .then((res) => res.json())
            .then((res) => {
                setCountriesList([...new Set(res.map(item => item.country))])
                setTableData(res)
                setSelectedCountryData(res)
            })
    }, [])

    const columns = [

        { label: "Name", accessor: "name"},
        { label: "country", accessor: "country"},
        { label: "Country Code", accessor: "alpha_two_code"},
        { label: "Domains", accessor: "domains"}
    ];

    //basic sort() function
    // const arr2 = ["z", "a", "b", "c"];

    // arr2.sort((a, b) => (a < b ? -1 : 1));
    // console.log(arr2); // ["a", "b", "c", "z"]

    const handleSorting = (sortField, sortOrder) => {
        if (sortField) {

            const sorted = [...tableData].sort((a, b) => {

                if (a[sortField] === null) return 1;
                if (b[sortField] === null) return -1;
                if (a[sortField] === null && b[sortField] === null) return 0;

                return (
                    a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                );
            });

            setTableData(sorted);
        }
    }


    const handleSortingChange = (accessor) => {
        const sortOrder =
            accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder)
    }

    const handleCountryChange = (countryName) => {
        // console.log(countryName);
        setSelectedCountryData(tableData.filter(c => c.country.includes(countryName)));
    }

    return (
        <>
            <table className='table'>
                {/* <TableHead {...{handleSorting,tableData }} /> */}
                <thead>
                    <tr>
                        <th key='name' onClick={() => handleSortingChange('name')}>Name</th>
                        <th key='country'>
                            <select
                                value={selectedOption}
                                onChange={e => handleCountryChange(e.target.value, setSelectedOption(e.target.value))}
                            >
                                {/* <option key='0' value='Country'>Country</option> */}
                                {countresList.map((item, index) => {
                                    return (
                                        <option key={index} value={item} selected={index === 0}>{item}</option>
                                    )
                                })}
                                <option value="Other Country" >Other Country</option>
                            </select>
                        </th>
                        <th key='alpha_two_code' onClick={() => handleSortingChange('alpha_two_code')}>Country Code</th>
                        <th key='domains' onClick={() => handleSortingChange('domains')}>Domains</th>
                        {/* {columns.map(({ label, accessor, sortable }) => {
                    return (
                    <th
                    key={accessor} 
                    onClick={sortable ? () => handleSortingChange(accessor):null}
                    
                    >
                        {label}
                    </th>
                    );
                })} */}
                    </tr>
                </thead>
                <tbody>
                    {selectedCountryData.map((data, index) => {
                        return (
                            <tr key={index}>
                                {columns.map(({ accessor }) => {
                                    const tData = data[accessor] ? data[accessor] : "_";
                                    return <td key={accessor}>{tData}</td>
                                })}
                            </tr>
                        );
                    })}
                </tbody>
                {/* <TableBody {...{ columns, tableData }} /> */}
            </table>
        </>
    );
}

export default Table;