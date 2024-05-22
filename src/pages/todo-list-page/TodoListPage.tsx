/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import React, {useEffect, useState} from 'react';
import {
    IonButton, IonButtons,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon, IonInput,
    IonItem,
    IonLabel,
    IonList, IonModal,
    IonReorderGroup,
    IonSelect, IonSelectOption,
    IonTitle, IonToast,
    IonToolbar, ItemReorderEventDetail
} from "@ionic/react";
import {add, checkmarkOutline} from "ionicons/icons";
import TodoListItem from "../../components/todo-list-item/TodoListItem";
import {ITodoList, ITodoListItem} from "../../common/models";
import {useTodoLists} from "../../hooks/useTodoLists";
import apiClient from "../../common/api-client";

const TodoListPage = () => {

    const {todoLists, setTodoLists, error} = useTodoLists();
    const [selectedTodoList, setSelectedTodoList] = useState<ITodoList | undefined>(undefined);
    const [completedTasks, setCompletedTasks] = useState<ITodoListItem[]>([]);
    const [notCompletedTasks, setNotCompletedTasks] = useState<ITodoListItem[]>([]);

    const [isReorderEnabled, setIsReorderEnabled] = useState<boolean>(false);
    const [isCreateTodoListModalOpen, setIsCreateTodoListModalOpen] = useState<boolean>(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState<boolean>(false);

    const [title, setTitle] = useState<string>("");
    const [errorOutput, setErrorOutput] = useState<string | undefined>();

    useEffect(() => {
        if (todoLists.length > 0) {
            setSelectedTodoList(selectedTodoList === undefined ? todoLists[0] : selectedTodoList);
            initCompletedAndNotCompletedTasks();
        }
    }, [todoLists, selectedTodoList]);

    const initCompletedAndNotCompletedTasks = () => {
        if (selectedTodoList) {
            setCompletedTasks(selectedTodoList.items.filter(x => x.isDone));
            setNotCompletedTasks(selectedTodoList.items.filter(x => !x.isDone));
        }
    }

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
        toggleIsDone(item.itemId);
    }

    const createTodoList = () => {
        if (!(title.trim() === "")) {
            setIsCreateTodoListModalOpen(false);
            // TODO: update userId here
            apiClient.post("/todolist", {title: title}, {
                params: {
                    userId: 1
                }
            })
                .then(res => {
                    setErrorOutput(undefined);
                    setTitle("");
                    setTodoLists([...todoLists, res.data]);
                })
                .catch(err => {
                    setErrorOutput(err.message);
                })
        }
    }

    const createTask = () => {
        if (selectedTodoList) {
            apiClient.post(`/todolist/${selectedTodoList.todoListId}/addItem`, {
                name: title,
                description: null,
                isDone: false,
            })
                .then(res => {
                    let todoListsWithoutSelectedTodoList = todoLists.filter(x => x.todoListId !== selectedTodoList.todoListId);
                    setTodoLists([...todoListsWithoutSelectedTodoList, {...selectedTodoList, items: res.data}])
                    setSelectedTodoList({...selectedTodoList, items: res.data});
                    setTitle("");
                    setErrorOutput(undefined);
                })
                .catch(err => {
                    setErrorOutput(err.message);
                })
        }
    }

    const deleteTask = (itemId: string) => {
        if (selectedTodoList) {
            apiClient.delete(`/todolist/item/${itemId}`)
                .then(res => {
                    let todoListsWithoutSelectedTodoList = todoLists.filter(x => x.todoListId !== selectedTodoList.todoListId);

                    setTodoLists([...todoListsWithoutSelectedTodoList, {
                        ...selectedTodoList,
                        items: selectedTodoList.items.filter(x => x.itemId !== res.data)
                    }]);
                    setSelectedTodoList({
                        ...selectedTodoList,
                        items: selectedTodoList.items.filter(x => x.itemId !== res.data)
                    });
                })
                .catch(err => {
                    setErrorOutput(err.message);
                })
        }
    }

    const toggleIsDone = (itemId: string) => {
        if (selectedTodoList) {
            apiClient.patch(`/todolist/item/${itemId}/toggleDone`)
                .then()
                .catch(err => {
                    setErrorOutput(err.message);
                })
        }
    }

    return (
        <IonContent>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Todo</IonTitle>
                    <IonButton className={"me-2"} slot={"end"}
                               onClick={() => setIsReorderEnabled(!isReorderEnabled)}>Edit</IonButton>
                    <IonButton className={"me-2"} slot={"end"} onClick={() => setIsCreateTodoListModalOpen(true)}>
                        <IonIcon slot={"icon-only"} icon={add}/>
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <div className={"flex flex-row gap-3"}>
                <IonItem className={"mt-2 mb-2 w-1/3"}>
                    <IonSelect aria-label="todolist" interface="popover" placeholder="Select a TodoList"
                               value={selectedTodoList?.todoListId} onIonChange={(e) => setSelectedTodoList(todoLists.find(x => x.todoListId === e.target.value))}>
                        {error ? <IonSelectOption>{error}</IonSelectOption> : todoLists.map(x => <IonSelectOption
                            value={x.todoListId}>{x.title}</IonSelectOption>)}
                    </IonSelect>
                </IonItem>
                <IonItem className={"mt-2 mb-2 w-2/3"}>
                    <IonInput
                        value={title}
                        onIonChange={(e) => setTitle(e.target.value ? "" + e.target.value : "")}
                        label="Task Name"
                        labelPlacement="stacked"
                        type="text"
                        placeholder="Task Name"
                        disabled={selectedTodoList === undefined}
                    />
                    <IonButton className={"h-12 w-1/4"} onClick={() => createTask()}>Add</IonButton>
                </IonItem>
            </div>
            <IonModal isOpen={isCreateTodoListModalOpen} onWillDismiss={() => {
                setIsCreateTodoListModalOpen(false)
            }}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setIsCreateTodoListModalOpen(false)}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Create TodoList</IonTitle>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => {
                                createTodoList()
                            }}>
                                Create
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonItem>
                        <IonInput
                            value={title}
                            onIonChange={(e) => setTitle(e.target.value ? "" + e.target.value : "")}
                            label="Name"
                            labelPlacement="stacked"
                            type="text"
                            placeholder="TodoList Name"
                        />
                    </IonItem>
                </IonContent>
            </IonModal>
            <IonModal isOpen={isCreateTaskModalOpen} onWillDismiss={() => {
                setIsCreateTaskModalOpen(false)
            }}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setIsCreateTaskModalOpen(false)}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Create TodoList</IonTitle>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => {
                                createTodoList()
                            }}>
                                Create
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonItem>
                        <IonInput
                            value={title}
                            onIonChange={(e) => setTitle(e.target.value ? "" + e.target.value : "")}
                            label="Name"
                            labelPlacement="stacked"
                            type="text"
                            placeholder="TodoList Name"
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            value={title}
                            onIonChange={(e) => setTitle(e.target.value ? "" + e.target.value : "")}
                            label="Name"
                            labelPlacement="stacked"
                            type="text"
                            placeholder="TodoList Name"
                        />
                    </IonItem>
                </IonContent>
            </IonModal>
            <IonToast
                isOpen={error !== undefined}
                message={errorOutput}
                duration={3000}
                buttons={[
                    {
                        text: 'Dismiss',
                        role: 'cancel'
                    },
                ]}
            ></IonToast>
            <>
                {selectedTodoList === undefined ?
                    <div className={"text-center"}>Select a TodoList to check your tasks.</div> :
                    <>
                        <IonList lines={"full"}>
                            <IonReorderGroup disabled={!isReorderEnabled} onIonItemReorder={handleReorder}>
                                {notCompletedTasks.map(x => <TodoListItem key={x.itemId} item={x}
                                                                          onToggleIsDoneCheckbox={onToggleIsDoneCheckbox}
                                                                          deleteItem={deleteTask}/>)}
                            </IonReorderGroup>
                        </IonList>
                        <IonChip className={"m-4"}>
                            <IonIcon icon={checkmarkOutline}></IonIcon>
                            <IonLabel>Completed Tasks</IonLabel>
                        </IonChip>
                        <IonList lines={"full"}>
                            <IonReorderGroup disabled={!isReorderEnabled} onIonItemReorder={handleReorder}>
                                {completedTasks.map(x => <TodoListItem key={x.itemId} item={x}
                                                                       onToggleIsDoneCheckbox={onToggleIsDoneCheckbox}
                                                                       deleteItem={deleteTask}/>)}
                            </IonReorderGroup>
                        </IonList>
                    </>
                }
            </>
        </IonContent>
    );
};

export default TodoListPage;