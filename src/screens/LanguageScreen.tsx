import React, { useEffect, useState, useCallback, useMemo } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Platform,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // 👈 Import i18n
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader"; 
import { AppLightColor } from "../styles/color";

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t, i18n } = useTranslation(); // 👈 Khởi tạo hook

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [isChanging, setIsChanging] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
    
    // Chạy animation khi vào màn hình
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [isFocused]);

  // Danh sách ngôn ngữ (Dùng useMemo để cập nhật khi đổi ngôn ngữ)
  const languages = useMemo(() => [
    { id: "vi", label: t("language.names.vi"), nativeName: "Tiếng Việt", flag: "🇻🇳" },
    { id: "en", label: t("language.names.en"), nativeName: "English", flag: "🇺🇸" },
    { id: "zh", label: t("language.names.zh"), nativeName: "中文", flag: "🇨🇳" },
  ], [t]);

  // Hàm đổi ngôn ngữ
  const changeLanguage = useCallback(async (langId: string) => {
    if (isChanging || langId === i18n.language) return;
    
    try {
      setIsChanging(true);
      setSelectedLang(langId);
      
      // Rung nhẹ phản hồi (chỉ hoạt động trên thiết bị thật)
      if (Platform.OS !== 'web') {
         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // Gọi i18n đổi ngôn ngữ
      await i18n.changeLanguage(langId);
      
      if (Platform.OS !== 'web') {
         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      setSelectedLang(i18n.language); // Revert nếu lỗi
    } finally {
      setIsChanging(false);
    }
  }, [isChanging, i18n]);

  const renderLanguageCard = (item: any) => {
    const isCurrent = item.id === i18n.language;
    const isTarget = item.id === selectedLang;

    return (
      <Animated.View key={item.id} style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginBottom: 12 }}>
        <TouchableOpacity
          style={[styles.languageCard, isTarget && styles.languageCardSelected]}
          onPress={() => changeLanguage(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <AppText style={styles.flagText}>{item.flag}</AppText>
              <View style={styles.textContainer}>
                <AppText variant="bold" style={styles.languageName}>{item.label}</AppText>
                <AppText style={styles.nativeName}>{item.nativeName}</AppText>
              </View>
            </View>
            
            <View style={styles.cardRight}>
              {isCurrent ? (
                <Ionicons name="checkmark-circle" size={24} color={AppLightColor.primary_color} />
              ) : isChanging && isTarget ? (
                <ActivityIndicator size="small" color={AppLightColor.primary_color} />
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <AppHeader 
        title={t("language.title")} 
        showBack={true} 
        onBackPress={() => navigation.goBack()} 
      />
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Phần Ngôn ngữ hiện tại */}
        <View style={styles.currentLanguageSection}>
          <AppText style={styles.sectionTitle}>{t("language.current_language")}</AppText>
          <View style={styles.currentLanguageCard}>
            <AppText style={styles.flagText}>
              {languages.find(l => l.id === i18n.language)?.flag || "🌐"}
            </AppText>
            <View style={{ marginLeft: 16 }}>
              <AppText variant="bold" style={styles.currentLanguageName}>
                {languages.find(l => l.id === i18n.language)?.label}
              </AppText>
              <AppText style={styles.currentNativeName}>
                {languages.find(l => l.id === i18n.language)?.nativeName}
              </AppText>
            </View>
          </View>
        </View>

        {/* Danh sách ngôn ngữ khả dụng */}
        <View style={styles.languagesSection}>
          <AppText style={styles.sectionTitle}>{t("language.available_languages")}</AppText>
          {languages
            .filter(lang => lang.id !== i18n.language)
            .map((lang) => renderLanguageCard(lang))}
        </View>

        {/* Thẻ thông tin */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={AppLightColor.primary_color} />
          <AppText style={styles.infoText}>{t("language.info")}</AppText>
        </View>
        
        <AppBottomSpace height={100} />
      </ScrollView>

      <AppMainNavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </AppSafeView>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  currentLanguageSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, color: '#666', marginBottom: 12, fontWeight: '600' },
  currentLanguageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: AppLightColor.primary_color,
  },
  flagText: { fontSize: 32 },
  currentLanguageName: { fontSize: 18, color: AppLightColor.primary_text },
  currentNativeName: { fontSize: 14, color: '#666' },
  languagesSection: { marginBottom: 20 },
  languageCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  languageCardSelected: { borderColor: AppLightColor.primary_color, backgroundColor: '#fff' },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  textContainer: { marginLeft: 16, flex: 1 },
  languageName: { fontSize: 16, color: '#1f2937' },
  nativeName: { fontSize: 14, color: '#6b7280' },
  cardRight: { marginLeft: 12 },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#0369a1' },
});