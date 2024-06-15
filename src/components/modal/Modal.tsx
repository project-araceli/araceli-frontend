/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 15.06.24
 */

import React, {ReactNode} from 'react';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar} from "@ionic/react";

interface IModalProps {
    children: ReactNode;
    title: string;
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    backgroundColor?: string;
}

const Modal = ({children, title, isOpen, setIsOpen, backgroundColor}: IModalProps) => {
    return (
        <IonModal style={{backgroundColor: backgroundColor}} isOpen={isOpen} onWillDismiss={() => setIsOpen(false)}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            {children}
        </IonModal>
    );
};

export default Modal;