/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 04.06.2024
 */
import {IonHeader, IonLabel, IonTitle} from "@ionic/react";
import Markdown from "markdown-to-jsx";
import {useEffect, useState} from "react";
import md from "./test.md"

const TestDocumentation = () => {
    // const [md, setMd] = useState<string>();

    // useEffect(() => {
    //     import('./test.md').then(res => {
    //         fetch(res.default).then(res => res.text()).then(res => setMd(res))
    //     })
    // }, []);


    return (
        <>
            <Markdown>{md}</Markdown>
        </>
    );
};

export default TestDocumentation;