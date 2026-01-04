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
import { useTranslation } from "react-i18next"; 
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader"; 

// 👇 1. Import Theme Store
import { useThemeStore } from "../store/useThemeStore";

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t, i18n } = useTranslation();
  
  // 👇 2. Lấy Theme
  const { theme, isDarkMode } = useThemeStore();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [isChanging, setIsChanging] = useState(false);

  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [isFocused]);

  const languages = useMemo(() => [
    { id: "vi", label: t("language.names.vi"), nativeName: "Tiếng Việt", flag: "🇻🇳" },
    { id: "en", label: t("language.names.en"), nativeName: "English", flag: "🇺🇸" },
    { id: "zh", label: t("language.names.zh"), nativeName: "中文", flag: "🇨🇳" },
  ], [t]);

  const changeLanguage = useCallback(async (langId: string) => {
    if (isChanging || langId === i18n.language) return;
    try {
      setIsChanging(true);
      setSelectedLang(langId);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await i18n.changeLanguage(langId);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) { setSelectedLang(i18n.language); } 
    finally { setIsChanging(false); }
  }, [isChanging, i18n]);

  const renderLanguageCard = (item: any) => {
    const isCurrent = item.id === i18n.language;
    const isTarget = item.id === selectedLang;

    return (
      <Animated.View key={item.id} style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginBottom: 12 }}>
        <TouchableOpacity
          style={[
            styles.languageCard, 
            { backgroundColor: theme.background_contrast, borderColor: theme.border },
            isTarget && { borderColor: theme.primary_color, backgroundColor: isDarkMode ? '#333' : '#fff' }
          ]}
          onPress={() => changeLanguage(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <AppText style={styles.flagText}>{item.flag}</AppText>
              <View style={styles.textContainer}>
                <AppText variant="bold" style={[styles.languageName, { color: theme.primary_text }]}>{item.label}</AppText>
                <AppText style={[styles.nativeName, { color: theme.placeholder_text }]}>{item.nativeName}</AppText>
              </View>
            </View>
            
            <View style={styles.cardRight}>
              {isCurrent ? (
                <Ionicons name="checkmark-circle" size={24} color={theme.primary_color} />
              ) : isChanging && isTarget ? (
                <ActivityIndicator size="small" color={theme.primary_color} />
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    // 👇 3. Background động
    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader 
        title={t("language.title")} 
        showBack={true} 
        onBackPress={() => navigation.goBack()} 
      />
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Current Language */}
        <View style={styles.currentLanguageSection}>
          <AppText style={[styles.sectionTitle, { color: theme.placeholder_text }]}>{t("language.current_language")}</AppText>
          <View style={[styles.currentLanguageCard, { backgroundColor: theme.background, borderColor: theme.primary_color }]}>
            <AppText style={styles.flagText}>
              {languages.find(l => l.id === i18n.language)?.flag || "🌐"}
            </AppText>
            <View style={{ marginLeft: 16 }}>
              <AppText variant="bold" style={[styles.currentLanguageName, { color: theme.primary_color }]}>
                {languages.find(l => l.id === i18n.language)?.label}
              </AppText>
              <AppText style={[styles.currentNativeName, { color: theme.placeholder_text }]}>
                {languages.find(l => l.id === i18n.language)?.nativeName}
              </AppText>
            </View>
          </View>
        </View>

        {/* Available Languages */}
        <View style={styles.languagesSection}>
          <AppText style={[styles.sectionTitle, { color: theme.placeholder_text }]}>{t("language.available_languages")}</AppText>
          {languages.filter(lang => lang.id !== i18n.language).map((lang) => renderLanguageCard(lang))}
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? 'rgba(3, 105, 161, 0.2)' : '#f0f9ff' }]}>
          <Ionicons name="information-circle" size={20} color={theme.primary_color} />
          <AppText style={[styles.infoText, { color: isDarkMode ? '#7DD3FC' : '#0369a1' }]}>{t("language.info")}</AppText>
        </View>
        
        <AppBottomSpace height={100} />
      </ScrollView>

      <AppMainNavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </AppSafeView>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  currentLanguageSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, marginBottom: 12, fontWeight: '600' },
  currentLanguageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  flagText: { fontSize: 32 },
  currentLanguageName: { fontSize: 18 },
  currentNativeName: { fontSize: 14 },
  languagesSection: { marginBottom: 20 },
  languageCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  textContainer: { marginLeft: 16, flex: 1 },
  languageName: { fontSize: 16 },
  nativeName: { fontSize: 14 },
  cardRight: { marginLeft: 12 },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13 },
});