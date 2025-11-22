import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppSafeView from '../components/AppSafeView'
import AppText from '../components/AppText'
import { AppLightColor } from '../styles/color'
import AppLogo from '../components/AppLogo'

const StartingScreen = () => {
  return (
    <AppSafeView style = {styles.container} >
        <AppLogo/>
        <AppText variant = "bold">This is start screen</AppText>
    </AppSafeView>
  )
}

export default StartingScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppLightColor.primary_color,
    }
})