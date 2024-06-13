/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */
import {ResourceType} from "./global-constants";

export interface ITodoListItem {
    itemId: string;
    name: string;
    description: string;
    isDone: boolean;
}

export interface ITodoList {
    todoListId: number;
    title: string;
    items: ITodoListItem[];
}

export interface IResource {
    resourceId: string;
    name: string;
    type: ResourceType;
    contentType?: string;
    description?: string;
    children?: IResource[];
    createdAt: string;
}