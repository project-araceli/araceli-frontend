/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 04.06.24
 */
import {useEffect, useState} from "react";
import {IResource} from "../common/models";
import apiClient from "../common/api-client";
import {CanceledError} from "axios";

const useResources = () => {
    const [resources, setResources] = useState<IResource[]>([]);
    const [error, setError] = useState<string | undefined>();

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState<string | null>();
    const [fileExtension, setFileExtension] = useState<string | null>();

    useEffect(() => {
        console.log("REFRESHED");
        console.log(fileExtension);
        const controller = new AbortController();
        apiClient.get("/resource", {params: {search: search, fileExtension: fileExtension === "all" ? null : fileExtension}, headers: {Authorization: "TOKEN"}, signal: controller.signal})
            .then(res => {setResources(res.data)})
            .catch(err => {
                if (err instanceof CanceledError) return;
                setError(err.message);
            });
        return () => controller.abort();
    }, [refreshing, search, fileExtension]);

    return {resources, setResources, error, setError, refreshing, setRefreshing, setSearch, setFileExtension};
}

export default useResources;