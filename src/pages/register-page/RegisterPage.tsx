/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 04.06.2024
 */
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonInput,
    IonItem,
    IonLabel,
    IonList, IonRouterLink
} from "@ionic/react";
import apiClient from "../../common/api-client";
import Seperator from "../../components/seperator/Seperator";
import {GoogleLogin} from "@react-oauth/google";
import React, {useState} from "react";
import {useCookies} from "react-cookie";

const RegisterPage = () => {
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [imageUrl, setImageUrl] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [cookies, setCookie] = useCookies();

    return (
        <>
            <IonGrid className={'h-full grid place-items-center'}>
                <IonCard className={'mx-auto'} mode={"ios"}>
                    <IonCardHeader>
                        <IonCardTitle className={'ion-text-center'}>Register</IonCardTitle>
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
                                <IonLabel position="floating">Email</IonLabel>
                                <IonInput type={"text"} value={email} clearInput={true} onIonInput={(ev: Event) => {
                                    setEmail((ev.target as HTMLIonInputElement).value as string)
                                }}/>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Profile Picture URL</IonLabel>
                                <IonInput type={"text"} value={imageUrl} clearInput={true} onIonInput={(ev: Event) => {
                                    setImageUrl((ev.target as HTMLIonInputElement).value as string)
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
                                apiClient.post("/auth/register", {username: username, email: email, imageUrl: imageUrl, password: password})
                                    .then(res => setCookie('auth-token', res.data, {
                                        path: "/",
                                        expires: new Date((new Date()).setDate((new Date()).getDate() + 30)),
                                        secure: true
                                    }))
                            }}>REGISTER</IonButton>

                            <Seperator text={"or"}/>

                            <div className={"w-full mx-auto rounded-2xl overflow-hidden flex justify-center bg-white"}>
                                <GoogleLogin
                                    onSuccess={credentialResponse => {
                                        console.log(credentialResponse);
                                        apiClient.post("/auth/googleAuthenticate", {},{headers: {Authorization: credentialResponse.credential}})
                                            .then(res => setCookie('auth-token', res.data, {
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

                            <IonRouterLink href={"/login"} className={"mt-2 hover:underline hover:text-blue-900"}>Have an Account already?</IonRouterLink>
                        </IonGrid>

                    </IonCardContent>

                </IonCard>
            </IonGrid>

        </>
    );
};

export default RegisterPage;