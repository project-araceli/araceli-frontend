/**
 * Project: araceli-frontend
 * Created by: Michael Hütter, Nico Bulut
 * Created at: 11.06.2024
 */
import {useEffect, useState} from "react";
import apiClient from "../../common/api-client";
import {IonImg} from "@ionic/react";
import {IResource} from "../../common/models";
import {useCookies} from "react-cookie";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ContentPreview = ({resource}: { resource: IResource }) => {

    const [content, setContent] = useState<string>("");
    const [cookies, setCookies] = useCookies();

    useEffect(() => {
        apiClient.get("/resource/download/" + resource.resourceId, {
            responseType: "blob",
        headers: {Authorization: `Bearer ${cookies['auth-token']}`}
        })
            .then(res => {
                const file = new Blob([res.data], {type: resource.contentType});
                console.log(resource.contentType);
                if (resource.contentType && resource.contentType.startsWith("text")) {
                    file.text().then(text => {
                        setContent(text);
                    });
                }
                if (resource.contentType && (resource.contentType.startsWith("image") || resource.contentType === ("application/pdf") || resource.contentType.startsWith("video"))) {
                    setContent(URL.createObjectURL(file));
                }
            })
            .catch(err => console.log(err));
    }, []);

    const renderContent = () => {
        if (resource.contentType && resource.contentType.startsWith("text")) {
            console.log(resource.contentType)
                return <ReactMarkdown children={content} remarkPlugins={[remarkGfm]}/>;
        }
        if (resource.contentType && resource.contentType.startsWith("image")) {
            return <IonImg src={content} alt={"This content cannot be previewed on your device."}/>;
        }
        if (resource.contentType && resource.contentType === "application/pdf") {
            return <iframe src={content} className={"w-full h-full"}></iframe>
        }
        if (resource.contentType && resource.contentType.startsWith("video")) {
            return <video controls loop preload="metadata" webkit-playsinline="webkit-playsinline"
                          src={content}></video>;
        }
        return <p>This content cannot be previewed.</p>;
    }

    return (
        <>
            {renderContent()}
        </>
    );
};

export default ContentPreview;