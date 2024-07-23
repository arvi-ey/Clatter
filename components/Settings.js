import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, Platform, TouchableOpacity, Alert, Linking, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { colors } from './Theme';
const { height, width } = Dimensions.get('window');
import Switch from '../common/Switch';

const Settings = ({ navigation }) => {
    const { user, EditUser, loading, UploadProfileImage, imageLoading } = useContext(AuthContext)
    const [hideTyping,setHideTyping]= useState()
    const [hideActive,setHideActive]= useState()
    const [hideHomeActive,setHideHomeActive]= useState()


    useEffect(()=>{
        if(user){
            setHideActive(user.hideActiveStatus)
            setHideTyping(user.hideTyping)
            setHideHomeActive(user.hideActiveStatusHome)
        }
    },[user])

    const Info =[
        {
            name:"Hide active status",
            value:"Active"
        },
        {
            name:"Hide typing",
            value:"Typing"
        },
        {
            name:"Hide home scrren active status",
            value:"HomeActive"
        },
    ]

    const OnSwitch = (value)=>{
        if(value === "Active"){
            setHideActive(!hideActive)
            EditUser({ hideActiveStatus: !hideActive })
        }
        if(value ==="Typing" ){
            setHideTyping(!hideTyping)
            EditUser({hideTyping: !hideTyping })
        }
        if(value === "HomeActive"){
            setHideHomeActive(!hideHomeActive)
            EditUser({hideActiveStatusHome: !hideHomeActive })
        }

    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: Font.Medium,
                fontSize: 20,
                color: user.dark_mode ? colors.WHITE : colors.BLACK
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.WHITE : colors.BLACK,
        });
    }, [navigation]);
  return (
    <ScrollView style={{flex:1,backgroundColor:user.dark_mode?colors.BLACK:colors.WHITE}} >
        {
            Info?.map((item,index)=>{
                return(
                    <View style={styles.MainView} key={index} >
                        <Text style={{fontFamily:Font.Medium,
                        color:user.dark_mode?colors.WHITE:colors.BLACK,fontSize:15}} >{item.name}</Text>
                        <Switch
                            onToggle={()=>OnSwitch(item.value)}
                            size={'medium'}
                            isOn={item.value==='Active'?hideActive:item.value==="Typing"?hideTyping:hideHomeActive}
                            onColor={colors.MAIN_COLOR}
                            offColor={colors.SWITCH_BG}
                            animationSpeed={300}
                            thumbOnStyle={{backgroundColor:colors.WHITE}}
                            // icon={<DarkModeIcon/>}
                        />
                    </View>
                )
            })
        }
    </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({
    MainView:{width:width-5,
    paddingLeft:10,
    height:40,
    marginVertical:5,
    alignItems:"center",
    flexDirection:'row',
    justifyContent:"space-between"
}
})