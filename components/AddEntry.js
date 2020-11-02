import React, {Component} from 'react';
import {connect} from 'react-redux'
import {View, Text,TouchableOpacity,Platform,StyleSheet} from 'react-native';
import MySlider from "./MySlider";
import MyStepper from "./MyStepper";
import DateHeader from "./DateHeader";
import {Ionicons} from '@expo/vector-icons';
import TextButton from './TextButton'
import {submitEntry,removeEntry} from "../utils/api";
import {white,purple} from '../utils/colors'
import {addEntry} from "../actions";
import {
    getDailyReminderValue,
    getMetricMetaInfo,
    timeToString,
    clearLocalNotification,
    setLocalNotification
} from "../utils/helpers";



function SubmitBtn({handlePress}){
    return (
        <View>
            <TouchableOpacity
                style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
                onPress={handlePress}>
                <Text
                    style={styles.submitBtnText}
                >Submit</Text>
            </TouchableOpacity>
        </View>

    )
}

class AddEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        }
        this.submit = this.submit.bind(this)
        this.reset = this.reset.bind(this)
        this.increment = this.increment.bind(this)
        this.decrement = this.decrement.bind(this)
        this.slide = this.slide.bind(this)

    }

    increment(metric) {
        const {max, step} = getMetricMetaInfo(metric)
        this.setState((state) => {
            const count = state[metric] + step

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })

    }

    decrement(metric) {

        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step

            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })

    }

    slide(metric, value) {
        this.setState(() => {
            return {
                [metric]: value,
            }

        })
    }

    submit(){
        const key = timeToString()
        const entry = this.state

        this.props.dispatch(addEntry({
            [key]:entry
        }))

        this.setState(() => {
            return {
                run: 0,
                bike: 0,
                swim: 0,
                sleep: 0,
                eat: 0,
            }
        })

        this.props.navigation.goBack()


        submitEntry({key,entry})

        clearLocalNotification().then(setLocalNotification())

    }

    reset(){
        const key = timeToString()

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        console.log(this.props)

        removeEntry(key)
    }


    render() {

        const metaInfo = getMetricMetaInfo()


        if(this.props.alreadyLogged){
            return (
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios'?'ios-happy-outline': 'md-happy'}
                        size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton
                        style={{padding:10}}
                        onPress={this.reset}
                    >
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {Object.keys(metaInfo).map((key) => {
                    const {getIcon, type, ...rest} = metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View
                            style={styles.row}
                            key={key}
                        >
                            {getIcon()}
                            {type === 'slider'
                                ? <MySlider
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                />
                                : <MyStepper
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />
                            }
                        </View>
                    )
                })}
                <SubmitBtn handlePress={this.submit}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:white,

    },
    row:{
        flexDirection:'row',
        flex:1,
        alignItems: 'center',
    },
    iosSubmitBtn:{
        backgroundColor:purple,
        padding:10,
        borderRadius:7,
        height:45,
        marginLeft:40,
        marginRight: 40,
    },
    androidSubmitBtn:{
        backgroundColor: purple,
        padding:10,
        paddingLeft:30,
        paddingRight:30,
        height:45,
        borderRadius:2,
        alignSelf:'flex-end',
        justifyContent:'center',
        alignItems:'center'

    },
    submitBtnText:{
        color:white,
        fontSize:22,
        textAlign:'center'


    },
    center:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        marginLeft:30,
        marginRight:30,
    }
})

function mapStateToProps(state){
    const key= timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)