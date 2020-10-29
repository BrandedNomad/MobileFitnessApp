import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {receiveEntries,addEntry} from "../actions";
import {timeToString, getDailyReminderValue} from "../utils/helpers";
import {fetchCalendarResults} from "../utils/api";
import UdaciFitnessCalendar from 'udacifitness-calendar'


class History extends Component {

    constructor(props){
        super(props)
        this.renderEmptyDate = this.renderEmptyDate.bind(this)
        this.renderItem = this.renderItem.bind(this)
    }

    componentDidMount(){
        const {dispatch} = this.props;
        fetchCalendarResults().then((entries)=>{
            dispatch(receiveEntries(entries))
        }).then(({entries})=>{
            console.log("yoohoo",entries)
            if(!entries[timeToString()]){
                dispatch(addEntry({
                    [timeToString()]:getDailyReminderValue()
                }))
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    renderItem=({today, ...metrics},formattedDate,key)=>{
        return (
            <View style={{flex:1}}>
                {today
                    ?<Text>{JSON.stringify(today)}</Text>
                    :<Text>{JSON.stringify(metrics)}</Text>
                }
            </View>
        )

    }

    renderEmptyDate(){
        return (
            <View style={{flex:1}}>
                <Text>No Data for this day</Text>
            </View>
        )
    }

    render(){


        const {entries} = this.props


        return (
            <View style={{flex:1}}>
                <UdaciFitnessCalendar
                    items={entries}
                    renderItem={this.renderItem}
                    renderEmptyDate={this.renderEmptyDate}
                    style={{flex:1}}
                />
            </View>
        )
    }
}

function mapStateToProps(entries){
    return{
        entries
    }
}

export default connect(mapStateToProps)(History)