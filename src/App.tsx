import {IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {Redirect, Route} from 'react-router-dom';
import Menu from './components/menu/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {useState} from "react";
import NavBar from "./components/navbar/NavBar";
import HomePage from "./pages/home-page/HomePage";
import TodoListPage from "./pages/todo-list-page/TodoListPage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import FileManagerPage from "./pages/file-manager-page/FileManagerPage";
import ChatPage from "./pages/chat-page/ChatPage";

setupIonicReact();

const App = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    /*if (!loggedIn) {
      return (
          <>
            <NavBar/>
          </>
      )
    }*/

    return (
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="main">
                    <IonRouterOutlet id="main">
                        <Route path="/">
                            <HomePage/>
                        </Route>
                        <Route path="/todolist">
                            <TodoListPage/>
                        </Route>
                        {/*<Route path="/idk" exact={true}>
                            <Redirect to="/folder/Inbox" />
                          </Route>*/}
                        <Route path="/idk" exact={true}>
                            <Menu/>
                            <Page/>
                        </Route>
                        <Route path={"/login"}>
                            <LoginPage/>
                        </Route>
                        <Route path="/file-manager">
                            <FileManagerPage/>
                        </Route>
                        <Route path={"/signup"}>
                            <RegisterPage/>
                        </Route>
                        <Route path={"/chat"}>
                            <ChatPage/>
                        </Route>
                    </IonRouterOutlet>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
