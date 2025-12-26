import { StyleSheet, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from "react-i18next"; // 👈 Import i18n

import AppSafeView from '../components/AppSafeView'
import AppIntroduceNavBar from '../components/AppIntroduceNavBar'
import Pic1 from '../assets/images/pic1.svg'
import Pic2 from '../assets/images/pic2.svg'
import Pic3 from '../assets/images/pic3.svg'
import Pic4 from '../assets/images/pic4.svg'
import Pic5 from '../assets/images/pic5.svg'
import Pic6 from '../assets/images/pic6.svg'
import AppText from '../components/AppText'
import { AppFonts } from '../styles/fonts'
import { AppLightColor } from '../styles/color'
import AppButton from '../components/AppButton'
import { RootStackParamList } from '../type/types'

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Introduce4Screen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { t } = useTranslation(); // 👈 Khởi tạo hook

  return (
    <AppSafeView>
        <View style={styles.picCol}>
            <View style={styles.picRow}>
                <Pic1 />
                <Pic2 />
            </View>
            <View style={styles.picRow}>
                <Pic3 />
                <Pic4 />
            </View>
            <View style={styles.picRow}>
                <Pic5 />
                <Pic6 />
            </View>
        </View>

        {/* Tiêu đề Chào mừng */}
        <AppText variant='bold' style={styles.title}>
            {t("intro.step4.title")}
        </AppText>

        {/* Phụ đề */}
        <AppText variant='light' style={styles.subtitle}>
            {t("intro.step4.subtitle")}
        </AppText>

        {/* Nút Người mới (Đăng ký) */}
        <AppButton 
            butName={t("intro.step4.btn_new")} 
            style={styles.button2} 
            style1={styles.buttext2} 
            onPress={() => navigation.navigate('SigninScreen')}
        />

        {/* Nút Người cũ (Đăng nhập) */}
        <AppButton 
            butName={t("intro.step4.btn_old")} 
            style={styles.button2} 
            style1={styles.buttext2} 
            onPress={() => navigation.navigate('LoginScreen')}
        />

        <AppIntroduceNavBar NavScreen='LoginScreen' style={styles.navBar} activeIndex={3}/>
    </AppSafeView>
  );
}

export default Introduce4Screen

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        top: 760,
    },
    picRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: 14,
    },
    picCol: {
        gap: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 30,
        fontFamily: AppFonts.RobotoSlabBold,
        alignSelf: 'center',
        color: AppLightColor.primary_color,
    },
    subtitle: {
        paddingHorizontal: 65,
        fontSize: 14,
        textAlign: 'center',
    },
    button2: {
        backgroundColor: AppLightColor.primary_color,
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
        height: "6%",
        marginTop: 20,
        borderRadius: 12,
        alignSelf: 'center'
    },
    buttext2: {
        color: AppLightColor.primary_text_constrast,
        fontWeight: "600",
        fontSize: 20,
        fontFamily: AppFonts.RobotoSlabBold
    },
})