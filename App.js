/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity
} from 'react-native';


export default class App extends Component<{}> {

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);

        this.map = new Map();
        this.map.set('Loading..','Loading..');
        this.index = 0;
        this.setState({
            word: this.map.entries().next().value[0]
        });
        this.getData();
        this.value = 0;
        this.animatedValue.addListener(({ value }) => {
            this.value = value;
        })
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        })
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })
    }
    getData() {
        return fetch('https://raw.githubusercontent.com/adambom/dictionary/master/dictionary.json')
            .then((response) => response.json())
            .then((responseJson) => {
                for (var key in responseJson){
                    this.map.set( key, responseJson[key] );
                }

            })
            .catch((error) => {
                console.error(error);
            });

    }

    flipCard() {
        if (this.value >= 90) {
            var keys = Array.from( this.map.keys() );
            this.setState({
                word: keys[this.index++%this.map.size]
            });

            Animated.spring(this.animatedValue,{
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();
        } else {
            var key = this.state.word;
            this.setState({
                word: this.map.get(key)
            });

            Animated.spring(this.animatedValue,{
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();

        }

    }

    render() {
        const frontAnimatedStyle = {
            transform: [
                { rotateY: this.frontInterpolate}
            ]
        }
        const backAnimatedStyle = {
            transform: [
                { rotateY: this.backInterpolate }
            ]
        }
        return (
            <View style={styles.container}>
              <TouchableOpacity onPress={() => this.flipCard()}>

                <View>
                  <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                      <Text style={styles.wordText}>
                        {this.state.word}
                    </Text>
                  </Animated.View>
                  <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
                    <Text style={styles.flipText}>
                        {this.state.word}

                    </Text>
                  </Animated.View>
                </View>
              </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#6A6A6A'
    },
    flipCard: {
        width: 300,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        backfaceVisibility: 'hidden',
        borderRadius: 10
    },
    flipCardBack: {
        backgroundColor: '#FFFFFF',
        position: "absolute",
        top: 0
    },
    wordText: {
        width: 290,
        fontSize: 20,
        textAlign: 'center',
        color: '#5D5759',
        fontWeight: 'bold'
    },
    flipText: {
        width: 290,
        textAlign: 'center',
        fontSize: 13,
        color: '#5D5759',
        fontStyle: 'italic',

    }
});
