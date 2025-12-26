export type RootStackParamList = {
  StartingScreen: undefined;
  IntroduceScreen: undefined;
  Introduce1Screen: undefined;
  Introduce2Screen: undefined;
  Introduce3Screen: undefined;
  Introduce4Screen: undefined;
  LoginScreen: undefined;
  SigninScreen: undefined;
  AuthStackNavigator: undefined;
  HomeScreen: undefined;
  NotificationScreen: undefined;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  SettingsScreen: undefined;
  NotificationSettingsScreen: undefined;
  SupportCenterScreen: undefined;
  LanguageScreen: undefined;
  RecipeDetailScreen: undefined;
  SearchResultScreen: undefined;
  ChefProfileScreen: undefined;
  FollowScreen: undefined;
  CreateRecipeScreen: undefined;
  ReviewScreen: undefined;
  CollectionDetailScreen: undefined;
  CategoriesScreen: undefined;
  CategoryDetailScreen: undefined;
  CommunityScreen: undefined;
  FamousChefsScreen: undefined;
  AdminDashboardScreen: undefined;
};

export type Recipe = {
  id: any;
  title: string;
  thumbnail: string | null;
  time: string;
  rating: number;
  description?: string;
};

export type Chef = {
  id: any;
  avatar_url: string | null;
  full_name: string;
};