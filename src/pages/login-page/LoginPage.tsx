import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
    IonCardTitle,
    IonGrid,
    IonInput,
    IonItem,
    IonLabel, IonList,
} from "@ionic/react";
import Seperator from "../../components/seperator/Seperator";
import {GoogleLogin} from "@react-oauth/google";
import axios from "axios";
import apiClient from "../../common/api-client";
import { useCookies } from 'react-cookie';

/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 16.04.24
 */

const LoginPage = () => {
    const [user, setUser] = useState();
    const [cookies, setCookie] = useCookies(['name'])

    // const login = useGoogleLogin({
    //     onSuccess: (codeResponse) => {
    //
    //         axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
    //             headers: {
    //                 Authorization: `Bearer ${codeResponse.access_token}`,
    //                 Accept: 'application/json'
    //
    //             },
    //         })
    //             .then(res => setUser(res.data))
    //     },
    // });
    //
    // useEffect(() => {
    //     console.log(user)
    // }, [user]);

    // const oneTapLogin = useGoogleOneTapLogin({
    //     onSuccess: credentialResponse => {
    //         console.log(credentialResponse);
    //     },
    //     onError: () => {
    //         console.log('Login Failed');
    //     },
    // });

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
                            {/*<LoginButton login={login}/>*/}
                            <div className={"w-full rounded-2xl overflow-hidden"}>
                                <GoogleLogin
                                    onSuccess={credentialResponse => {
                                        console.log(credentialResponse);
                                        apiClient.post("/auth/login", {},{headers: {Authorization: credentialResponse.credential}})
                                            .then(res => console.log(res.data))
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
                        </IonGrid>

                    </IonCardContent>

                </IonCard>
            </IonGrid>

        </>

);
};

export default LoginPage;