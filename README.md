POTPAN 🍳
Smart Fridge & Recipe Suggestion App

Course: IE307.Q12 - Group 9

POTPAN helps users manage their fridge inventory and suggests recipes based on available ingredients using a smart matching algorithm.

✨ Key Features
Authentication: Secure Login/Register with auto-profile creation (Supabase Auth).

Smart Fridge: Manage ingredients by categories (Meat, Veggies, Spices, etc.).

Recipe Finder: Suggests dishes based on what you currently have (SQL-based logic).

Profile Management: Update personal info and avatar.

🛠 Tech Stack
Frontend: React Native (Expo SDK 50), TypeScript.

State Management: Zustand.

Backend: Supabase (PostgreSQL, Auth, RPC, Triggers).

🚀 Getting Started
1. Installation
Bash

git clone https://github.com/your-username/potpan.git
cd potpan
npm install
2. Environment Setup
Create a .env file in the root directory:

Đoạn mã

EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Database Setup (Required)
Run the following SQL in your Supabase SQL Editor to enable features:

A. Auto-create Profile Trigger:

SQL

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user'
);

-- Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
B. Recipe Search Function:

SQL

CREATE OR REPLACE FUNCTION public.find_recipes_by_ingredients(selected_ingredients text[])
RETURNS SETOF public.recipes AS $$
BEGIN
  RETURN QUERY
  SELECT r.*
  FROM public.recipes r
  JOIN (
    SELECT recipe_id, COUNT(*) as matches 
    FROM recipe_ingredients 
    WHERE ingredient_name = ANY(selected_ingredients)
    GROUP BY recipe_id
  ) stats ON r.id = stats.recipe_id
  ORDER BY stats.matches DESC;
END;
$$ LANGUAGE plpgsql;
4. Run App
Bash

npx expo start
Press i for iOS Simulator.

Press a for Android Emulator.

👥 Contributors (Group 9)
[Member Name] - ID: ...

[Member Name] - ID: ...

[Member Name] - ID: ...

📄 License
This project is for educational purposes.
