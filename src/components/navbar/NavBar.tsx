import React from 'react';
import {IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/react";
import {personCircle} from "ionicons/icons";

const NavBar = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle slot={'start'}>araceli</IonTitle>
                <IonButtons slot={'end'}>
                    <IonButton fill={'clear'} ><IonIcon icon={personCircle} size={'large'}/></IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default NavBar;