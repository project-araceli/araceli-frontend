import React from 'react';
import './Seperator.css'

/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 16.04.24
 */

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
