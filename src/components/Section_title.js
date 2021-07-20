import React from 'react';

function Section_title (props) {
    
    return (
        <div className="section_title">
            <h2 className="title">
                {props.title}
            </h2>
        </div>
    )
}

export default Section_title;