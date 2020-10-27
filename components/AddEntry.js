import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {getMetricMetaInfo, timeToString} from '../utils/helpers'
import MySlider from "./MySlider";
import MyStepper from "./MyStepper";
import DateHeader from "./DateHeader";
import {TouchableOpacity} from "react-native";


function SubmitBtn({handlePress}){
    return (
        <View>
            <TouchableOpacity
                onPress={handlePress}>
                <Text>Submit</Text>
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
        // const key = timeToString()
        // const entry = this.state

        this.setState(() => {
            return {
                run: 0,
                bike: 0,
                swim: 0,
                sleep: 0,
                eat: 0,
            }
        })

    }

    render() {

        const metaInfo = getMetricMetaInfo()

        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                <Text>{JSON.stringify(this.state)}</Text>
                {Object.keys(metaInfo).map((key) => {
                    const {getIcon, type, ...rest} = metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View key={key}>
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

export default AddEntry