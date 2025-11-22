import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppSafeView from '../components/AppSafeView'
import AppText from '../components/AppText'
import AppLogo from '../components/AppLogo'

const Intro1Screen = () => {
  return (
    <AppSafeView>
        <AppText variant='bold'>This is intro1</AppText>
    </AppSafeView>
  )
}

export default Intro1Screen

const styles = StyleSheet.create({})