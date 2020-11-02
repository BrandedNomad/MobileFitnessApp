import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Animated
} from 'react-native'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import {Foundation} from '@expo/vector-icons'
import {purple,white} from "../utils/colors";
import {calculateDirection} from "../utils/helpers";


class Live extends Component {

    constructor(props) {
        super(props);
        this.state={
            coords:null,
            status:null,
            direction:'',
            bounceValue: new Animated.Value(1)
        }
        this.setLocation = this.setLocation.bind(this)
        this.askPermission = this.askPermission.bind(this)
    }

    componentDidMount(){
        Permissions.getAsync(Permissions.LOCATION)
            .then(({status})=>{
                if(status === 'granted'){
                    return this.setLocation()
                }

                this.setState(()=>{
                    return {
                        status
                    }
                })
            }).catch((error)=>{
                console.warn('Error getting location permission', error);
                this.setState(()=>{
                    return {
                        status:'undetermined'
                    }
                })

        })
    }

    askPermission(){
        Permissions.askAsync(Permissions.LOCATION)
            .then(({status})=>{
                if(status === 'granted'){
                    return this.setLocation()
                }

                this.setState(()=>{
                    return {
                        status
                    }
                })
            }).catch((error)=>{
                console.warn("Error asking Location permission",error)
            })
    }

    setLocation(){
        const unsubscribeLocation = Location.watchPositionAsync({
            accuracy:Location.Accuracy.BestForNavigation,
            timeInterval:1,
        },({coords})=>{
            const newDirection = calculateDirection(coords.heading)
            const {direction,bounceValue} = this.state

            if(newDirection !== direction){
                Animated.sequence([
                    Animated.timing(bounceValue,{duration:200,toValue:1.10,useNativeDriver:true}),
                    Animated.spring(bounceValue,{toValue:1,friction:4,useNativeDriver:true})
                ]).start()
            }

            this.setState(()=>{
                return {
                    coords,
                    status:'granted',
                    direction:newDirection,

                }
            })
        })

    }

    // componentWillUnmount() {
    //     const unsubscribe = this.state.unsubscribeLocation
    //     unsubscribe()
    // }

    render(){


        const {status,coords,direction,bounceValue} = this.state
        console.log("here:", direction)

        if(status === null){
            return (
                <View style={[styles.container,{marginTop:30}]}>
                    <ActivityIndicator size='large' color='#000000' />
                </View>
                )
        }

        if(status === 'denied'){
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>
                        You denied your location. You can fix this by visiting your settings and enabling location services for this app.
                    </Text>
                </View>
            )
        }

        if(status === 'undetermined'){
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>
                        You need to enable location services for this app.
                    </Text>
                    <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                        <Text style={styles.buttonText}>
                            Enable
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You're heading</Text>
                    <Animated.Text
                        style={[styles.direction,{transform:[{scale:bounceValue}]}]}
                    >
                        {direction}
                    </Animated.Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color:white}]}>
                            Altitude
                        </Text>
                        <Text style={[styles.subHeader, {color:white}]}>
                            {Math.round(coords.altitude)} Meters
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color:white}]}>
                            Speed
                        </Text>
                        <Text style={[styles.subHeader, {color:white}]}>
                            {(coords.speed).toFixed(1)} KPH
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-between'
    },
    center:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        marginLeft:30,
        marginRight:30,
    },
    button:{
        padding:10,
        backgroundColor:purple,
        alignSelf:'center',
        borderRadius:5,
        margin:20,
    },
    buttonText:{
        color:white,
        fontSize:20,
    },
    directionContainer:{
        flex:1,
        textAlign:'center'
    },
    header:{
        fontSize:35,
        textAlign:'center'
    },
    direction:{
        color:purple,
        fontSize:100,
        textAlign:'center'
    },
    metricContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        backgroundColor:purple
    },
    metric:{
        flex:1,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'rgba(255,255,255,0.1)',
        marginTop:20,
        marginBottom:20,
        marginLeft:10,
        marginRight:10,

    },
    subHeader:{
        fontSize:25,
        textAlign:'center',
        marginTop:5,
    }
})


export default Live;