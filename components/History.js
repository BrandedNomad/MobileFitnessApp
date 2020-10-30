import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {receiveEntries,addEntry} from "../actions";
import {timeToString, getDailyReminderValue} from "../utils/helpers";
import {fetchCalendarResults} from "../utils/api";
import UdaciFitnessCalendar from 'udacifitness-calendar'
import {white} from '../utils/colors'
import DateHeader from "./DateHeader";


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
            <View style={[styles.item,{flex:1}]}>
                {today
                    ?<View style={{flex:1}}>
                        <DateHeader date={formattedDate}/>
                        <Text style={styles.noDataText}>
                            today
                        </Text>
                    </View>
                    :<TouchableOpacity onPress={()=> console.log("Pressed")}>
                        <Text>{JSON.stringify(metrics)}</Text>
                    </TouchableOpacity>
                }
            </View>
        )

    }

    renderEmptyDate(formattedDate){
        return (
            <View style={[styles.item, {flex:1}]}>
                <DateHeader date={formattedDate}/>
                <Text style={styles.noDataText}>
                    You didn't log any data on this day.
                </Text>
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

const styles = StyleSheet.create({
    item:{
        backgroundColor:white,
        borderRadius:Platform.OS === 'ios' ? 16:2,
        padding:20,
        marginLeft:10,
        marginRight:10,
        marginTop:17,
        justifyContent:'center',
        shadowRadius:3,
        shadowOpacity:0.8,
        shadowColor:'rgba(0,0,0,0.24)',
        shadowOffset:{
            width:0,
            height:3
        },

    },
    noDataText:{
        fontSize:20,
        paddingTop:20,
        paddingBottom:20,
    }
})

function mapStateToProps(entries){
    return{
        entries
    }
}

export default connect(mapStateToProps)(History)