
import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import AddEntry from "./AddEntry";
import {createStore} from "redux";
import {Provider} from 'react-redux'
import reducer from '../reducers'
import History from './History'
import {purple, white,gray} from "../utils/colors";
import {FontAwesome,Ionicons} from '@expo/vector-icons'
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import Constants from 'expo-constants';
import EntryDetails from "./EntryDetails";
import Live from "./Live";



function MyStatusBar({backgroundColor,...props}){
    return (
        <View
            style={{backgroundColor,height:Constants.statusBarHeight}}
        >
            <StatusBar translucent backgroundColor={backgroundColor} {...props}/>

        </View>
    )

}

const tabs = ()=>{
    const Tab = createBottomTabNavigator();

     return (
         <Tab.Navigator
             screenOptions={({ route }) => ({
                 tabBarIcon: ({tintColor }) => {
                     if(route.name === 'History') {
                         return <FontAwesome name='bookmark' size={30} color={Platform.OS ==='ios' ? tintColor: white}/>
                     } else if (route.name === 'Add') {
                         return <FontAwesome name='plus-square' size={30} color={Platform.OS ==='ios' ? tintColor: white} />;
                     } else if (route.name === 'Live') {
                         return <Ionicons name='ios-speedometer' size={30} color={Platform.OS ==='ios' ? tintColor: white}/>;
                     }
                 },
             })}
             navigationOptions={{
                 header:null
             }}
             tabBarOptions={{
                 activeTintColor: Platform.OS === 'ios' ? purple: white,
                 inactiveTintColor: gray,
                 style:{
                     height:56,
                     backgroundColor:Platform.OS === 'ios' ? white:purple,
                     shadowColor: 'rgba(0,0,0,0.24)',
                     shadowOffset:{
                         width:0,
                         height:3,
                     },
                     shadowRadius:6,
                     shadowOpacity:1,
                 }
             }}
         >
             <Tab.Screen name='History' component={History}/>
             <Tab.Screen name='Add' component={AddEntry}/>
             <Tab.Screen name='Live' component={Live}/>
         </Tab.Navigator>
     )
}

const mainNavigator = () =>{
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: white,
                headerStyle:{
                    backgroundColor:purple,
                }
            }}

        >
            <Stack.Screen name='Home' component={tabs}/>
            <Stack.Screen
                name='EntryDetails'
                component={EntryDetails}
                options={({route})=>({title:route.params.dynamicTitle})}/>
        </Stack.Navigator>
    )
}

export default function App() {



  return (
      <Provider store={createStore(reducer)}>
          <MyStatusBar backgroundColor={purple} barStyle='light-content'/>
          <NavigationContainer>
              {mainNavigator()}
          </NavigationContainer>
      </Provider>

  );
}






