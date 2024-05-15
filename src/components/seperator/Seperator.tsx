import React from 'react';
import './Seperator.css'

interface Props {
    text: string;
}

const Seperator = ({text}: Props) => {
    return (
        <>
            <div className="separator">{text}</div>
        </>
    );
};

export default Seperator;
