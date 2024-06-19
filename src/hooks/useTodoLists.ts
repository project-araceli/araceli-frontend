/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import apiClient from "../common/api-client";
import {useEffect, useState} from "react";
import {CanceledError} from "axios";
import {ITodoList} from "../common/models";
import {useCookies} from "react-cookie";

const useTodoLists = () => {
    const [todoLists, setTodoLists] = useState<ITodoList[]>([]);
    const [error, setError] = useState<string>();
    const [cookies, setCookies] = useCookies();

    useEffect(() => {
        const controller = new AbortController();
        apiClient.get("/todolist", {signal: controller.signal, headers: { Authorization: `Bearer ${cookies['auth-token']}`}})
            .then(res => setTodoLists(res.data))
            .catch(err => {
                if (err instanceof CanceledError) return;
                setError(err.message);
            });
        return () => controller.abort();
    }, []);
    return {todoLists, setTodoLists, error};
}

export {useTodoLists};