import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ToggleSwitch from 'toggle-switch-react-native';

const Switch = ({isOn,icon,trackOnStyle,trackOffStyle,onColor,offColor,size,onToggle,animationSpeed,thumbOnStyle,thumbOffStyle}) => {
  return (
    <ToggleSwitch
          isOn={isOn}
          onColor={onColor}
          offColor={offColor}
          size={size}
          onToggle={onToggle}
          animationSpeed={animationSpeed}
          thumbOnStyle={thumbOnStyle}
          thumbOffStyle={thumbOffStyle}
          trackOnStyle={trackOnStyle}
          trackOffStyle={trackOffStyle}
          icon={icon}
          />
  )
}

export default Switch

const styles = StyleSheet.create({})