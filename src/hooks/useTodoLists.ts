/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import apiClient from "../common/api-client";
import {useEffect, useState} from "react";
import {CanceledError} from "axios";
import {ITodoList} from "../common/models";


// TODO: add correct userId
const useTodoLists = () => {
    const [todoLists, setTodoLists] = useState<ITodoList[]>([]);
    const [error, setError] = useState<string>();
    useEffect(() => {
        const controller = new AbortController();
        apiClient.get("/todolist", {params: {userId: 1}, signal: controller.signal})
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