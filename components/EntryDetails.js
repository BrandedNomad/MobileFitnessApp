import React, {Component} from 'react'
import {View, Text, StyleSheet, AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import {white} from "../utils/colors";
import MetricCard from "./MetricCard";
import {addEntry} from "../actions";
import {removeEntry} from "../utils/api";
import {timeToString,getDailyReminderValue} from "../utils/helpers";
import TextButton from "./TextButton";
import {NOTIFICATION_KEY} from "../utils/helpers";


class EntryDetails extends Component {

    constructor(props) {
        super(props);
        this.reset = this.reset.bind(this)
    }

    reset(){
        const {remove,goBack, entryId} = this.props
        remove()
        goBack()
        removeEntry(entryId)
        AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(null))
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.metrics !== null && !nextProps.metrics.today
    }

    render(){
       const {metrics} = this.props


        return(
            <View style={styles.container}>
                <MetricCard metrics={metrics}/>
                <TextButton onPress={this.reset} style={{margin:20}}>
                    RESET
                </TextButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:white,
        padding:15
    }
})

function mapStateToProps(state,{route}){
    const entryId = route.params.entryId;
    return {
        entryId,
        metrics:state[entryId]
    }

}

function mapDispatchToProps(dispatch, {route, navigation}){
    const {entryId} = route.params
    return {
        remove: ()=> dispatch(addEntry({
            [entryId]:timeToString() === entryId
                ? getDailyReminderValue()
                : null
        })),
        goBack: navigation.goBack
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EntryDetails)