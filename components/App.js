
import React from 'react';
import { View } from 'react-native';
import AddEntry from "./AddEntry";
import {createStore} from "redux";
import {Provider} from 'react-redux'
import reducer from '../reducers'
import History from './History'


export default function App() {
  return (
      <Provider store={createStore(reducer)}>
          <View style={{flex:1}}>
              <View style={{height:30}}>
              </View>
              <History/>
          </View>
      </Provider>

  );
}






