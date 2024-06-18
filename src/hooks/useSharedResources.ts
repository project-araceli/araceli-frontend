/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 18.06.24
 */
import {useEffect, useState} from "react";
import {IResource} from "../common/models";
import apiClient from "../common/api-client";
import {CanceledError} from "axios";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router-dom";

const useSharedResources = () => {
    const [sharedResources, setSharedResources] = useState<IResource[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [cookies, setCookies] = useCookies();


    useEffect(() => {
        const controller = new AbortController();
        apiClient.get("/resource/shared", {headers: { Authorization: `Bearer ${cookies['auth-token']}`}, signal: controller.signal})
            .then(res => {setSharedResources(res.data)})
            .catch(err => {
                if (err instanceof CanceledError) return;
                setError(err.message);
            });
        return () => controller.abort();
    }, []);

    return {sharedResources, setSharedResources, error, setError};
}

export default useSharedResources;