import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ImageBackground,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
    type ImageSourcePropType
} from "react-native";
import E1 from "../assets/eli1.svg";
import E2 from '../assets/eli2.svg';
import E3 from "../assets/eli3.svg";



const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const BG_SHIFT_Y = -SCREEN_H * 0.08;
const BG_SHIFT_X = 0;
const BG_SCALE = 1.0;


export default function Screen() {

    const router = useRouter();
    const { ima } = useLocalSearchParams<{ ima?: string }>();

    const urlFromParam =
        typeof ima === "string" && ima.length > 0 ? decodeURIComponent(ima) : undefined;

    const bgSource: ImageSourcePropType =
        urlFromParam ? { uri: urlFromParam } : require("../assets/MIY.svg");
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ImageBackground
                source={bgSource}
                resizeMode="cover"
                style={styles.background}
                imageStyle={styles.bgImage}
            >
                <LinearGradient
                    colors={[
                        "rgba(255,255,255,1)",
                        "rgba(255,255,255,0)",
                    ]}
                    locations={[0.25, 0.95]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.topFade}
                />



                {/* Header trắng mờ */}

                <Text style={styles.title}>Các Tính Năng Chính</Text>
                <Text style={styles.subtitle}>Cung cấp cho người dùng trải nghiệm tuyệt vời</Text>

                <View>
                    <Text style={styles.T1}>Tìm kiếm công thức</Text>
                    <E1 style={styles.E1} />
                    <Text style={styles.T2}>Gợi ý món ăn</Text>
                    <E2 style={styles.E2} />
                    <Text style={styles.T3}>Mạng xã hội</Text>
                    <E3 style={styles.E3} />
                </View>

                {/* GRADIENT MỜ Ở DƯỚI */}
                <LinearGradient
                    colors={[
                        "rgba(255,255,255,0)",
                        "rgba(255,255,255,1)"
                    ]}
                    locations={[0, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.bottomFade}
                />



                {/* Dots */}
                <View style={styles.dots}>
                    <View style={[styles.dot, { opacity: 1 }]} />
                    <View style={[styles.dot, { opacity: 1 }]} />
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={[styles.dot, { opacity: 1 }]} />
                </View>

                {/* Nút trái,phải */}
                <Pressable style={[styles.muiten, { left: 24 }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </Pressable>
                <Pressable
                    style={[styles.muiten, { right: 24 }]}
                    onPress={() =>
                        router.push({
                            pathname: "/page1-2",
                            params: { ima: encodeURIComponent(urlFromParam ?? "") },
                        })
                    }
                >
                    <Ionicons name="arrow-forward" size={28} color="#fff" />
                </Pressable>
            </ImageBackground>
        </View>

    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "rgba(185, 169, 169, 1)" },
    background: { flex: 1 },
    bgImage: {

        top: 80,
    },


    topFade: {
        position: 'absolute',
        width: 450,
        height: 330,

    },
    bottomFade: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 220,
    },
    title: {
        top: 60,
        left: 16,
        right: 16,
        fontSize: 25,
        paddingHorizontal: 16,
        fontStyle: 'normal',
        fontWeight: "700",
        color: "#111",
        lineHeight: 30,
        letterSpacing: 0.04,
        marginBottom: 4
    },
    subtitle: {
        fontStyle: "italic",
        fontSize: 15,
        color: "#000000",
        fontWeight: 400,
        letterSpacing: 0.04,
        lineHeight: 18,
        top: 60,
        left: 16,
        right: 16,
        paddingHorizontal: 16,
    },
    ring: {
        position: "absolute",
        borderWidth: 3,
        borderColor: "rgba(255,255,255,0.95)",
        backgroundColor: "rgba(255,255,255,0.06)",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
    },
    dots: {
        position: "absolute",
        bottom: 52,
        left: 100,
        right: 100,
        flexDirection: "row",
        justifyContent: 'space-around',
        gap: 10,

    },
    dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#ffffffff" },
    dotActive: { opacity: 1, width: 9, height: 9, backgroundColor: "#000000ff" },

    muiten: {
        position: "absolute",
        bottom: 36,
        width: 52,
        height: 52,
        borderRadius: 52,
        backgroundColor: "#FF782C",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF782C",
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    E1: {
        flex: 1,
        overflow: "hidden",

        position: 'absolute',
        width: 318.4,
        height: 153.17,
        left: 12.4,
        top: 189.06,
        transform: [{ rotate: "2deg" }],

    },
    E2: {
        flex: 1,
        overflow: "hidden",
        position: 'absolute',
        width: 295.19,
        height: 153.17,
        left: 100,
        top: 389,
    },
    E3: {
        flex: 1,
        overflow: "hidden",
        position: 'absolute',
        width: 283.52,
        height: 153.17,
        left: 8.94,
        top: 581,
    },
    T1: {

        position: 'absolute',
        width: 298,
        height: 68,
        left: 26,
        top: 251,
        color: "#fff",
        fontSize: 29,
        fontStyle: 'italic',
        fontWeight: 900,
        lineHeight: 44,
    },
    T2: {

        position: 'absolute',
        width: 200,
        height: 68,
        left: 141,
        top: 445,
        color: "#fff",
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: 900,
        lineHeight: 44,

    },
    T3: {
        position: 'absolute',
        width: 186,
        height: 54,
        left: 63,
        top: 639,
        color: "#fff",
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: 900,
        lineHeight: 44,

    }
});
