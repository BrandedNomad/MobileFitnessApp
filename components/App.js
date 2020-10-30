
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
import Constants from 'expo-constants';



function MyStatusBar({backgroundColor,...props}){
    return (
        <View
            style={{backgroundColor,height:Constants.statusBarHeight}}
        >
            <StatusBar translucent backgroundColor={backgroundColor} {...props}/>

        </View>
    )

}

export default function App() {
  const Tab = createBottomTabNavigator();


  return (
      <Provider store={createStore(reducer)}>
          <MyStatusBar backgroundColor={purple} barStyle='light-content'/>
          <NavigationContainer>
              <Tab.Navigator
                  screenOptions={({ route }) => ({
                      tabBarIcon: ({tintColor }) => {
                          if(route.name === 'History') {
                              return <FontAwesome name='bookmark' size={30} color={Platform.OS ==='ios' ? tintColor: white}/>
                          } else if (route.name === 'Add') {
                              return <FontAwesome name='plus-square' size={30} color={Platform.OS ==='ios' ? tintColor: white} />;
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
              </Tab.Navigator>
          </NavigationContainer>
      </Provider>

  );
}






