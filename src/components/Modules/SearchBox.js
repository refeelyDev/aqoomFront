import React from 'react';

function SearchBox (props) {
    return (
        <div className="search_box_wrap">
            <div method="post">
                <div className="icon icon_magnify"></div>
                <input type="text" name="member_search" onChange={(ev) => props.searchMember(ev)} placeholder="Search for a member"></input>
            </div>
        </div>
    )
}

export default SearchBox;