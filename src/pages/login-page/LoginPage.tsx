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

const LoginPage = () => {
    const [user, setUser] = useState();


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
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    console.log(credentialResponse);
                                }}
                                shape="circle"
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />


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