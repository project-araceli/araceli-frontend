/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 18.06.2024
 */
import {useEffect, useState} from "react";
import {IUser} from "../common/models";
import {useCookies} from "react-cookie";
import apiClient from "../common/api-client";
import {CanceledError} from "axios";

const useUsers = () => {
    const [users, setUsers] = useState<String[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [cookies, setCookies] = useCookies();

    useEffect(() => {
        const controller = new AbortController();
        apiClient.get("/user/all", {headers: { Authorization: `Bearer ${cookies['auth-token']}`}, signal: controller.signal})
            .then(res => {
                console.log(users)
                setUsers(res.data)
            })
            .catch(err => {
                if (err instanceof CanceledError) return;
                setError(err.message);
            });
        return () => controller.abort();
    }, []);

    return {users};
}

export default useUsers;