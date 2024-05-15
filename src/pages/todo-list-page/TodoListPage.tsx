/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonReorderGroup,
    IonSelect, IonSelectOption, IonText,
    IonTitle,
    IonToolbar, ItemReorderEventDetail
} from "@ionic/react";
import {checkmarkOutline} from "ionicons/icons";
import TodoListItem from "../../components/todo-list-item/TodoListItem";
import {ITodoList, ITodoListItem} from "../../common/models";
import {useTodoLists} from "../../hooks/useTodoLists";

const TodoListPage = () => {

    const {todoLists, error} = useTodoLists();
    const [selectedTodoList, setSelectedTodoList] = useState<ITodoList | undefined>(undefined);
    const [completedTasks, setCompletedTasks] = useState<ITodoListItem[]>([]);
    const [notCompletedTasks, setNotCompletedTasks] = useState<ITodoListItem[]>([]);
    const [isReorderEnabled, setIsReorderEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (todoLists.length > 0) {
            console.log("HELLO");
            setSelectedTodoList(todoLists[0]);
            console.log(selectedTodoList);
            if (selectedTodoList) {
                setCompletedTasks(selectedTodoList.items.filter(x => x.isDone));
                setNotCompletedTasks(selectedTodoList.items.filter(x => !x.isDone));
            }
        }
    }, [todoLists]);

    const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
        console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
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
                    <IonButton className={"me-2"} slot={"end"}
                               onClick={() => setIsReorderEnabled(!isReorderEnabled)}>Edit</IonButton>
                    <IonButton className={"me-2"} slot={"end"}
                               onClick={() => setIsReorderEnabled(!isReorderEnabled)}>
                        <IonIcon icon={""} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonItem className={"mt-2 mb-2"}>
                <IonSelect aria-label="todolist" interface="popover" placeholder="Select a TodoList" value={selectedTodoList}>
                    {error ? <IonSelectOption>{error}</IonSelectOption> : todoLists.map(x => <IonSelectOption onClick={() => setSelectedTodoList(x)}
                        value={x.todoListId}>{x.title}</IonSelectOption>)}
                </IonSelect>
            </IonItem>
            <>
                {selectedTodoList === undefined ? <div className={"text-center"}>Select a TodoList to check your tasks.</div> :
                    <>
                        <IonList lines={"full"}>
                            <IonReorderGroup disabled={isReorderEnabled} onIonItemReorder={handleReorder}>
                                {notCompletedTasks.map(x => <TodoListItem key={x.itemId} item={x}
                                                                          onToggleIsDoneCheckbox={onToggleIsDoneCheckbox}/>)}
                            </IonReorderGroup>
                        </IonList>
                        <IonChip className={"m-4"}>
                            <IonIcon icon={checkmarkOutline}></IonIcon>
                            <IonLabel>Completed Tasks</IonLabel>
                        </IonChip>
                        <IonList lines={"full"}>
                            <IonReorderGroup disabled={isReorderEnabled} onIonItemReorder={handleReorder}>
                                {completedTasks.map(x => <TodoListItem key={x.itemId} item={x}
                                                                       onToggleIsDoneCheckbox={onToggleIsDoneCheckbox}/>)}
                            </IonReorderGroup>
                        </IonList>
                    </>
                }
            </>
        </IonContent>
    );
};

export default TodoListPage;