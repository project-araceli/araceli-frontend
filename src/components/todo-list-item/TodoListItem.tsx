/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import React from 'react';
import {IonButton, IonCheckbox, IonIcon, IonItem, IonLabel} from "@ionic/react";
import {trash} from "ionicons/icons";
import {ITodoListItem} from "../../common/models";

interface ITodoListItemProps {
    item: ITodoListItem;
    onToggleIsDoneCheckbox: (item: ITodoListItem) => void;
}

const TodoListItem = ({item, onToggleIsDoneCheckbox}: ITodoListItemProps) => {

    const handleOnClickCheckbox = () => {
        item.isDone = !item.isDone;
        console.log(item.isDone);
        onToggleIsDoneCheckbox(item);
    }
    return (
        <IonItem button={false}>
            <IonCheckbox slot={"start"} checked={item.isDone} onClick={() => handleOnClickCheckbox()}/>
            <IonLabel>{item.name}</IonLabel>
            <IonButton color={"danger"}>
                <IonIcon slot="icon-only" icon={trash}></IonIcon>
            </IonButton>
        </IonItem>
    );
};

export default TodoListItem;