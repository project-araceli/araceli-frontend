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
    IonCardTitle, IonCol, IonContent, IonGrid, IonPage, IonRow
} from "@ionic/react";

const HomePage = () => {
    return (
        <>
            <IonPage>
                <IonContent>
                    <NavBar/>
                    <div className={"flex flex-col gap-10"}>
                        <div className={"text-5xl mt-10 text-center font-bold p-5"}>Araceli - a simple file management &
                            cloud platform
                        </div>
                        <div className={"flex flex-row justify-evenly flex-wrap"}>
                            <IonCard style={{width: 450}}>
                                <IonCardHeader>
                                    <IonCardTitle>Sign up today & get 0.0001 GB free storage space!</IonCardTitle>
                                    <IonCardSubtitle>Sign up with Google or create an Araceli account</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonButton href={"/signup"}>Sign up</IonButton>
                                </IonCardContent>
                            </IonCard>
                            <IonCard style={{width: 450}}>
                                <IonCardHeader>
                                    <IonCardTitle>Already have an account? Log into your account.</IonCardTitle>
                                    <IonCardSubtitle>Login with Google, or with your username/email and
                                        password</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonButton href={"/login"}>Login</IonButton>
                                </IonCardContent>
                            </IonCard>
                        </div>
                        <div className={"flex flex-row justify-evenly"}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol sizeXs={"12"} sizeSm={"6"} sizeLg={"4"}>
                                        <IonCard>
                                            <img alt="Silhouette of mountains" height={"100"}
                                                 src="https://ionicframework.com/docs/img/demos/card-media.png"/>
                                            <IonCardHeader>
                                                <IonCardTitle>Simple & Fast.</IonCardTitle>
                                            </IonCardHeader>

                                            <IonCardContent>Araceli tries to be as simple as possible in order to
                                                provide the
                                                optimal user experience. We use modern and fast frameworks to ensure
                                                fast loading
                                                times.
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol sizeXs={"12"} sizeSm={"6"} sizeLg={"4"}>
                                        <IonCard>
                                            <img alt="Silhouette of mountains" height={"100"}
                                                 src="https://ionicframework.com/docs/img/demos/card-media.png"/>
                                            <IonCardHeader>
                                                <IonCardTitle>Open-source.</IonCardTitle>
                                            </IonCardHeader>

                                            <IonCardContent className={"flex flex-col gap-3"}>Imagine some inspirational
                                                text about open source software here.
                                                <IonButton href={"https://github.com/project-araceli"}>Go To Github</IonButton>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol sizeXs={"12"} sizeSm={"6"} sizeLg={"4"}>
                                        <IonCard>
                                            <img alt="Silhouette of mountains" height={"100"}
                                                 src="https://ionicframework.com/docs/img/demos/card-media.png"/>
                                            <IonCardHeader>
                                                <IonCardTitle>Documentation</IonCardTitle>
                                            </IonCardHeader>

                                            <IonCardContent className={"flex flex-col gap-3"}>
                                                This application is well-documented.
                                                <IonButton href={"/documentation"}>Go To Documentation</IonButton>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default HomePage;