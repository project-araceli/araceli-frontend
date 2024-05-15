import React from 'react';
import {
    IonButton, IonButtons,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
    IonCardTitle,
    IonCheckbox,
    IonGrid,
    IonInput,
    IonItem,
    IonLabel, IonList,
    IonMenu
} from "@ionic/react";
import NavBar from "../../components/navbar/NavBar";
import Seperator from "../../components/seperator/Seperator";
import {GoogleLogin, useGoogleLogin} from "@react-oauth/google";
import LoginButton from "../../components/login-button/LoginButton";

const LoginPage = () => {

    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });

    return (
        <>
            <IonGrid className={'h-full grid place-items-center'}>
                <IonCard className={'mx-auto'} mode={"ios"}>
                    <IonCardHeader>
                        <IonCardTitle className={'ion-text-center'}>Login</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonList inset={true} lines={"inset"}>
                            <IonItem>
                                <IonLabel position="floating">Username / E-Mail</IonLabel>
                                <IonInput/>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Password</IonLabel>
                                <IonInput type="password"/>
                            </IonItem>

                        </IonList>

                        <IonGrid>
                            <IonButton size={'small'} className={'w-full font-bold'}>LOGIN</IonButton>
                            <Seperator text={"or"}/>
                            {/*<LoginButton/>*/}
                            <LoginButton login={login}/>
                        </IonGrid>

                    </IonCardContent>

                </IonCard>
            </IonGrid>

        </>

);
};

export default LoginPage;