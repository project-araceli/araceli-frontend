import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
    IonCardTitle,
    IonGrid,
    IonInput,
    IonItem,
    IonLabel, IonList, IonRouterLink,
} from "@ionic/react";
import Seperator from "../../components/seperator/Seperator";
import {GoogleLogin, useGoogleLogin, useGoogleOAuth} from "@react-oauth/google";
import axios from "axios";
import apiClient from "../../common/api-client";
import { useCookies } from 'react-cookie';
import * as path from "node:path";
import LoginButton from "../../components/login-button/LoginButton";

/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 16.04.24
 */

const LoginPage = () => {
    const [user, setUser] = useState();
    const [cookies, setCookie] = useCookies();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    useEffect(() => {
        if(cookies['auth-token']) {

        }
    }, []);

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
                                <IonLabel position="floating">Username</IonLabel>
                                <IonInput type={"text"} value={username} clearInput={true} onIonInput={(ev: Event) => {
                                    setUsername((ev.target as HTMLIonInputElement).value as string)
                                }}/>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Password</IonLabel>
                                <IonInput type="password" value={password} clearInput={true} onIonInput={(ev: Event) => {
                                    setPassword((ev.target as HTMLIonInputElement).value as string)
                                }}/>
                            </IonItem>

                        </IonList>

                        <IonGrid className={"grid gap-2"}>
                            <IonButton size={'small'} className={'w-full font-bold'} onClick={() => {
                                apiClient.post("/auth/authenticate", {username: username, password: password})
                                    .then(res => setCookie('auth-token', res.data.token, {
                                        path: "/",
                                        expires: new Date((new Date()).setDate((new Date()).getDate() + 30)),
                                        secure: true
                                    }))
                            }}>LOGIN</IonButton>
                            <Seperator text={"or"}/>
                            <div className={"w-full mx-auto rounded-2xl overflow-hidden flex justify-center bg-white"}>
                                <GoogleLogin
                                    onSuccess={credentialResponse => {
                                        console.log(credentialResponse);
                                        apiClient.post("/auth/googleAuthenticate", {token: credentialResponse.credential})
                                            .then(res => setCookie('auth-token', res.data.token, {
                                                path: "/",
                                                expires: new Date((new Date()).setDate((new Date()).getDate() + 30)),
                                                secure: true
                                            }))
                                        console.log(credentialResponse);
                                    }}
                                    shape="circle"
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                            </div>



                            {/*<GoogleButton type={"dark"} onClick={() => console.log("Test")}/>*/}
                            {/*<LoginButton login={oneTapLogin}/>*/}
                            <IonRouterLink href={"/signup"} className={"mt-2 hover:underline hover:text-blue-900"}>Need a new Account?</IonRouterLink>

                        </IonGrid>
                    </IonCardContent>

                </IonCard>
            </IonGrid>

        </>

);
};

export default LoginPage;