import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Alert
} from 'react-native';

import Hawkular from './Hawkular'
import { accelerometer, HawkularAccelerometer } from './Sensors-Hawkular';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            started:false,
            hawkular_status: {
                version: '',
                gitSHA1: ''
            },
            speed: 0,
            lastSpeed: 0,
        };
        const basic_auth = {
            username: 'jdoe',
            password: 'password'
        }
        this.hawkular = new Hawkular("https://livingontheedge.hawkular.org", basic_auth);
        this.hawkularPedometer = new HawkularAccelerometer(this.hawkular);
/*        accelerometer((x) =>{
            this.setState({
                speed: Math.round(x)
            });
        });

         setInterval(() => {
            if (this.state.lastSpeed === this.state.speed) {
                this.setState({
                    speed: 0
                });
            } else {
                this.setState({
                    lastSpeed: this.state.speed
                });
            }
        }, 5000);*/


    }


    render() {
        const c = this.state.count;

        return (
          <View style={styles.container}>
            <Text style={styles.instructions}>
                Hawkular version: {this.state.hawkular_status.version}
            </Text>
            <Text>
                Git SHA1: {this.state.hawkular_status.gitSHA1}
            </Text>
            <Text>
             Counter: {c}
            </Text>
            <Text>
            Speed: {this.state.speed}
            </Text>
            <Button onPress={this.onPress} title="Send counter" color="#841584" accessibilityLabel="Learn more about this purple button" />
            <Button onPress={this.onStartPress} title={this.state.started ? "Stop":"Start"} color="#841584" accessibilityLabel="Learn more about this purple button" />

          </View>
        );
    }


    onPress = () => { 
        if (!this.state.started) {
          return;
        }
        this.hawkular.sendCounter("counter1", this.state.count+1);
        this.setState({
          count: this.state.count+1
        }); 
  }


    onStartPress = () => {
        this.getHawkularStatus();
        this.setState({
          started: !this.state.started
        });
    }


    getHawkularStatus = () => {
        this.hawkular.getStatus((json) => {
            console.log('setState', json);
            this.setState({
                hawkular_status: {
                    version: json['Implementation-Version'],
                    gitSHA1: json['Built-From-Git-SHA1']
                }
            });
        });
    }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => App);