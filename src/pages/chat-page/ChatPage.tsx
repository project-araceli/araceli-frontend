/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 15.06.24
 */
import {Client} from "@stomp/stompjs";
import {
    IonButton,
    IonContent, IonFooter,
    IonHeader,
    IonInput, IonItem, IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React, {useEffect, useRef, useState} from "react";
import MessageItem from "../../components/message-item/MessageItem";
import {IMessage} from "../../common/models";

const ChatPage = () => {
    const client = useRef<Client>();
    const [text, setText] = useState<string | undefined>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [lastMessage, setLastMessage] = useState<IMessage | undefined>();
    // TODO: replace when auth works
    const SENDER = "test";

    const initWebSocketConnection = () => {
        let temp = new Client({
            brokerURL: "ws://localhost:8080/chat"
        });
        temp.onConnect = function (frame) {
            temp.subscribe("/topic/messages", (x) => {
                setLastMessage(JSON.parse(x.body) as unknown as IMessage);
            });
        }
        temp.activate();
        client.current = temp;
    }

    const sendMessage = () => {
        if (client.current) {
            if (text && text.trim() !== "") {
                client.current.publish({
                    destination: "/app/chat",
                    body: JSON.stringify({content: text})
                });
            }
        } else {
            initWebSocketConnection();
        }
    }

    useEffect(() => {
        if (!client.current) {
            initWebSocketConnection();
        }
    }, []);

    useEffect(() => {
        if (lastMessage) {
            if (messages.length + 1 > 7) {
                const temp = messages.slice(1);
                setMessages([...temp, lastMessage]);
            } else {
                setMessages([...messages, lastMessage]);
            }
        }
    }, [lastMessage]);

    return (
        <IonPage>
            <div className={"w-full h-full flex flex-row justify-center items-center"}>
                <div className={"w-2/3 h-3/4 justify-self-center rounded-xl overflow-hidden border-black"}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle className={"text-center"}>Global Chat</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen color={"light"}>
                        <div className={"w-full h-full p-5 flex flex-col justify-between gap-4"}
                             style={{height: "92%"}}>
                            <div className={"w-full overflow-hidden"} style={{maxHeight: "90%"}}>
                                {messages.map(x => <MessageItem
                                    key={x.key} message={x} left={x.sender.username !== SENDER}/>)}
                            </div>
                            <div className={"w-full flex flex-row gap-2"}>
                                <div className={"w-11/12 rounded-xl"} style={{backgroundColor: "#1F1F1F"}}>
                                    <IonInput label="Send a message..." labelPlacement="floating" fill="outline"
                                              value={text} onKeyDown={(e) => e.key === "Enter" ? sendMessage() : {}}
                                              onIonInput={(e) => setText("" + e.target.value)}></IonInput>
                                </div>
                                <IonButton onClick={() => {
                                    sendMessage()
                                }}>Send</IonButton>
                            </div>
                        </div>
                    </IonContent>
                    <IonFooter>
                        <IonToolbar>
                            <IonTitle className={"text-center"}>Global Chat</IonTitle>
                        </IonToolbar>
                    </IonFooter>
                </div>
            </div>
        </IonPage>
    );
};

export default ChatPage;