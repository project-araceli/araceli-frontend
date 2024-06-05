/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 04.06.2024
 */
import {
    IonAccordion,
    IonAccordionGroup, IonButtons, IonContent,
    IonHeader,
    IonIcon, IonImg,
    IonItem,
    IonLabel, IonList,
    IonMenu, IonMenuButton, IonMenuToggle, IonNav, IonNavLink,
    IonPage, IonRouterOutlet, IonSplitPane, IonText, IonTitle,
    IonToolbar
} from "@ionic/react";
import TestDocumentation from "../../components/documentations/TestDocumentation";
import {
    arrowDown,
    arrowDownCircle,
    arrowDownOutline,
    arrowDownSharp,
    chevronDown,
    eyedropSharp,
    mail
} from "ionicons/icons";
import {Route} from "react-router-dom";

const DocumentationPage = () => {
    // return (
    //     <>
    //         <IonMenu contentId="main-content" >
    //             <IonHeader>
    //                 <IonToolbar>
    //                     <IonTitle>Menu Content</IonTitle>
    //                 </IonToolbar>
    //             </IonHeader>
    //             <IonContent className="ion-padding">
    //                 <IonAccordionGroup mode={"ios"}>
    //                     <IonAccordion value="first">
    //                         <IonItem slot="header">
    //                             <IonLabel>First Accordion</IonLabel>
    //                         </IonItem>
    //                         <div slot={"content"}>
    //                             <IonNavLink component={() => TestDocumentation}>
    //                                 Test
    //                             </IonNavLink>
    //                         </div>
    //                     </IonAccordion>
    //                 </IonAccordionGroup>
    //             </IonContent>
    //         </IonMenu>
    //         <IonPage id="main-content">
    //             <IonHeader>
    //                 <IonToolbar>
    //                     <IonButtons slot="start">
    //                         <IonMenuButton></IonMenuButton>
    //                     </IonButtons>
    //                     <IonTitle>Menu</IonTitle>
    //                 </IonToolbar>
    //             </IonHeader>
    //             <IonContent className="ion-padding">Tap the button in the toolbar to open the menu.</IonContent>
    //         </IonPage>
    //     </>
    // );

    return (
      <>
          <IonSplitPane contentId={"main-content"}>
              <IonMenu contentId="main-content" side="start">
                  <IonHeader>
                      <IonToolbar>
                          <IonTitle>Menu</IonTitle>
                      </IonToolbar>
                  </IonHeader>
                  <IonContent>
                      <IonAccordionGroup value={"category1"}>
                          <IonAccordion value={"category1"} toggle-icon={chevronDown} mode={"ios"}>
                              <IonItem slot={"header"}>
                                  <IonLabel>Category One</IonLabel>
                              </IonItem>

                              <IonList id={"category-1-list"} slot={"content"}>
                                  <IonMenuToggle auto-hide={false}>
                                      <IonItem routerDirection={"root"} routerOptions={{}} routerLink={"/documentation/test"} lines={"none"} detail={false}>
                                          <IonIcon slot={"start"} icon={mail}></IonIcon>
                                          <IonLabel>Mail</IonLabel>
                                      </IonItem>
                                  </IonMenuToggle>
                              </IonList>
                          </IonAccordion>
                      </IonAccordionGroup>
                  </IonContent>
              </IonMenu>
              <IonRouterOutlet id={"main-content"}>
                  <Route path="/documentation/test" component={TestDocumentation} exact/>
              </IonRouterOutlet>
          </IonSplitPane>
      </>
    );
};

export default DocumentationPage;