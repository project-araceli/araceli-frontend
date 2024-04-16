/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 10.04.24
 */

import React from 'react';
import NavBar from "../../components/navbar/NavBar";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle, IonContent,
    IonHeader
} from "@ionic/react";

const HomePage = () => {
    return (
        <>
            <NavBar/>
            <div className={"flex flex-col gap-10"}>
                <div className={"text-5xl mt-10 text-center font-bold"}>Araceli - a simple file management & cloud platform</div>
                <div className={"flex flex-row justify-evenly flex-wrap"}>
                    <IonCard style={{width: 450}}>
                        <IonCardHeader>
                            <IonCardTitle>Sign up today & get 0.0001 GB free storage space!</IonCardTitle>
                            <IonCardSubtitle>Sign up with Google or create an Araceli account</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonButton>Sign up</IonButton>
                        </IonCardContent>
                    </IonCard>
                    <IonCard style={{width: 450}}>
                        <IonCardHeader>
                            <IonCardTitle>Already have an account? Log into your account.</IonCardTitle>
                            <IonCardSubtitle>Login with Google, or with your username/email and password</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonButton>Login</IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>
                <div className={"flex flex-row justify-evenly"}>
                    <IonCard>
                        <img alt="Silhouette of mountains" height={"100"} src="https://ionicframework.com/docs/img/demos/card-media.png" />
                        <IonCardHeader>
                            <IonCardTitle>Simple & Fast.</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>Araceli tries to be as simple as possible in order to provide the optimal user experience. We use modern and fast frameworks to ensure fast loading times.</IonCardContent>
                    </IonCard>
                    <IonCard>
                        <img alt="Silhouette of mountains" height={"100"} src="https://ionicframework.com/docs/img/demos/card-media.png" />
                        <IonCardHeader>
                            <IonCardTitle>Open-source.</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent></IonCardContent>
                    </IonCard>
                    <IonCard>
                        <img alt="Silhouette of mountains" height={"100"} src="https://ionicframework.com/docs/img/demos/card-media.png" />
                        <IonCardHeader>
                            <IonCardTitle>Documentation</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent className={"flex flex-col gap-3"}>
                            This application is well-documented
                            <IonButton>Go to documentation</IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>
            </div>

        </>
    );
};

export default HomePage;