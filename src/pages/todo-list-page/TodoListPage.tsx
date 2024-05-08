/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import React, {useEffect, useState} from 'react';
import {
    IonAvatar, IonButton, IonCheckbox, IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem, IonItemGroup, IonItemOption, IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList, IonReorder, IonReorderGroup,
    IonTitle,
    IonToolbar, ItemReorderEventDetail
} from "@ionic/react";
import {airplane, checkmarkOutline, closeCircle, pin, share, trash} from "ionicons/icons";
import TodoListItem from "../../components/todo-list-item/TodoListItem";
import {ITodoListItem} from "../../common/models";

const TodoListPage = () => {

    const DATA = [
        {
            itemId: "1",
            name: "task 1",
            description: "idk lol",
            isDone: true,
        },
        {
            itemId: "2",
            name: "task 2",
            description: "idk lol",
            isDone: false,
        },
        {
            itemId: "3",
            name: "task 3",
            description: "idk lol",
            isDone: true,
        },
        {
            itemId: "4",
            name: "task 4",
            description: "idk lol",
            isDone: false,
        }
    ]

    const [completedTasks, setCompletedTasks] = useState<ITodoListItem[]>([]);
    const [notCompletedTasks, setNotCompletedTasks] = useState<ITodoListItem[]>([]);

    useEffect(() => {
        setCompletedTasks(DATA.filter(x => x.isDone));
        setNotCompletedTasks(DATA.filter(x => !x.isDone));
    }, []);

    function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
        // The `from` and `to` properties contain the index of the item
        // when the drag started and ended, respectively
        console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

        // Finish the reorder and position the item in the DOM based on
        // where the gesture ended. This method can also be called directly
        // by the reorder group
        event.detail.complete();
    }

    const onToggleIsDoneCheckbox = (item: ITodoListItem) => {
        if (item.isDone) {
            setCompletedTasks([...completedTasks, item]);
            setNotCompletedTasks(notCompletedTasks.filter(x => x.itemId !== item.itemId));
        } else {
            setNotCompletedTasks([...notCompletedTasks, item]);
            setCompletedTasks(completedTasks.filter(x => x.itemId !== item.itemId));
        }
    }

    return (
        <IonContent>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Todo</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonList lines={"full"}>
                <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                    {notCompletedTasks.map(x => <TodoListItem key={x.itemId} item={x} onToggleIsDoneCheckbox={onToggleIsDoneCheckbox}/>)}
                </IonReorderGroup>
            </IonList>
            <IonChip className={"m-4"}>
                <IonIcon icon={checkmarkOutline}></IonIcon>
                <IonLabel>Completed Tasks</IonLabel>
            </IonChip>
            <IonList lines={"full"}>
                <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                    {completedTasks.map(x => <TodoListItem key={x.itemId} item={x} onToggleIsDoneCheckbox={onToggleIsDoneCheckbox}/>)}
                </IonReorderGroup>
            </IonList>
        </IonContent>
    );
};

export default TodoListPage;