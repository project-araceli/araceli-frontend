/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 16.06.24
 */

import React from 'react';
import {IMessage} from "../../common/models";

interface IMessageItemProps {
    message: IMessage;
    left: boolean;
}

const MessageItem = ({message, left}: IMessageItemProps) => {
    let direction = "justify-start";
    if (!left) {
        direction = "justify-end";
    }
    return (
        <div className={"w-full p-1 flex flex-row " + direction}>
            <div className={"bg-gray-600 p-2 rounded-xl flex flex-col"} style={{backgroundColor: "#1F1F1F", maxWidth: "50%"}}>
                <span className={"text-blue-500"}>{message.sender.username}</span>
                <span className={"text-xl"}>{message.content}</span>
            </div>
        </div>
    );
};

export default MessageItem;