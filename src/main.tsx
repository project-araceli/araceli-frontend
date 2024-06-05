import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./main.css";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {CookiesProvider} from "react-cookie";
import {Auth0Provider} from "@auth0/auth0-react";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <CookiesProvider>
        <GoogleOAuthProvider clientId={'367685876658-85cfq004p82u8jbv1km7869osee3piip.apps.googleusercontent.com'}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </GoogleOAuthProvider>
    </CookiesProvider>

);