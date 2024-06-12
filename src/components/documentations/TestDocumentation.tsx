/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 04.06.2024
 */
import {IonHeader, IonLabel, IonText, IonTitle} from "@ionic/react";
import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Markdown.css"

interface Props {
    markdownPath: string
}

const TestDocumentation = ({markdownPath}: Props) => {
    const [md, setMd] = useState<string>();


    useEffect(() => {
        fetch(markdownPath)
            .then(res => res.text())
            .then(text => setMd(text))
    }, [markdownPath]);


    return (
        <div className={"p-4"}>
            <ReactMarkdown children={md} remarkPlugins={[remarkGfm]}/>
        </div>
    );
};

export default TestDocumentation;