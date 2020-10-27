import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {getMetricMetaInfo} from '../utils/helpers'

class AddEntry extends Component {
    render(){
        return(
            <View>
                <Text>Add Entry</Text>
                {getMetricMetaInfo('bike').getIcon()}
            </View>

        )
    }
}

export default AddEntry