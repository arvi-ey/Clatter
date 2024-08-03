import React from 'react';
import {
    SafeAreaView,
    Image,
    StyleSheet,
    FlatList,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { colors } from "./Theme"
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        image: require('../assets/on2.png'),
        title: 'Best Digital Solution',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: '2',
        image: require('../assets/on3.png'),
        title: 'Achieve Your Goals',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        id: '3',
        image: require('../assets/on4.png'),
        title: 'Increase Your Value',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
];

const Slide = ({ item }) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image
                source={item?.image}
                style={{ height: '85%', width, resizeMode: 'contain' }}
            />
            <View>
                <Text style={styles.title}>{item?.title}</Text>
                <Text style={styles.subtitle}>{item?.subtitle}</Text>
            </View>
        </View>
    );
};

const Onboardingpage = ({ navigation }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
    const ref = React.useRef();
    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };
    const goToNextSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex != slides.length) {
            const offset = nextSlideIndex * width;
            ref?.current.scrollToOffset({ offset });
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const getStarted = async () => {
        await AsyncStorage.setItem("loaded", "App loaded")
        navigation.replace("Signin")
    }

    const skip = () => {
        const lastSlideIndex = slides.length - 1;
        const offset = lastSlideIndex * width;
        ref?.current.scrollToOffset({ offset });
        setCurrentSlideIndex(lastSlideIndex);
    };

    const Footer = () => {
        return (
            <View
                style={{
                    height: height * 0.25,
                    justifyContent: 'space-around',
                    width,
                    alignItems: "center",
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentSlideIndex == index && {
                                    backgroundColor: colors.MAIN_COLOR,
                                    width: 25,
                                },
                            ]}
                        />
                    ))}
                </View>

                <View style={{ marginBottom: 20, width: "90%" }}>
                    {currentSlideIndex == slides.length - 1 ? (
                        <View style={{ height: 50 }}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={getStarted}
                            >
                                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: colors.WHITE }}>
                                    GET STARTED
                                </Text>
                                <AntDesign name="right" size={24} color={colors.WHITE} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.btn,
                                    {
                                        borderColor: colors.BLACK,
                                        borderWidth: 2,
                                        borderColor: colors.MAIN_COLOR,
                                        backgroundColor: colors.BACKGROUND_COLOR,
                                    },
                                ]}
                                onPress={skip}>
                                <Text
                                    style={{
                                        fontFamily: "Ubuntu-Bold",
                                        fontSize: 15,
                                        color: colors.MAIN_COLOR,
                                    }}>
                                    SKIP
                                </Text>
                            </TouchableOpacity>
                            <View style={{ width: 15 }} />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={goToNextSlide}
                                style={[styles.btn,]}>
                                <Text
                                    style={{
                                        fontFamily: "Ubuntu-Bold",
                                        fontSize: 15,
                                        color: colors.WHITE
                                    }}>
                                    NEXT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View >
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.BACKGROUND_COLOR }}>
            <StatusBar backgroundColor={colors.BACKGROUND_COLOR} />
            <FlatList
                ref={ref}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                contentContainerStyle={{ height: height * 0.75 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={slides}
                pagingEnabled
                renderItem={({ item }) => <Slide item={item} />}
            />
            <Footer />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    subtitle: {
        color: colors.GREY,
        fontSize: 13,
        maxWidth: '90%',
        textAlign: 'center',
        lineHeight: 23,
        fontFamily: "Ubuntu-Light"
    },
    title: {
        color: colors.BLACK,
        fontSize: 22,
        fontFamily: "Ubuntu-Bold",
        textAlign: 'center',
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    indicator: {
        height: 2.5,
        width: 10,
        backgroundColor: 'grey',
        marginHorizontal: 3,
        borderRadius: 2,
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 5,
        backgroundColor: colors.MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        gap: 10
    },
});
export default Onboardingpage;