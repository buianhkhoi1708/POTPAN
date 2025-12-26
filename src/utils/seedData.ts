import { Alert } from "react-native";
import { supabase } from "../config/supabaseClient";
import { Asset } from "expo-asset";
import { decode } from "base64-arraybuffer";
import { readAsStringAsync } from "expo-file-system/legacy";

// ID CỦA BẠN (Bùi Anh Khôi)
const MY_USER_ID = "de0ddcdf-8987-4c75-8b1c-094fce7a48dc";

// --- DỮ LIỆU LOCAL ---
const myLocalRecipes = [
{
  title: "Canh Khổ Qua Nhồi Thịt",
  description:
    "Canh khổ qua nhồi thịt là món ăn quen thuộc của người miền Nam, đặc biệt trong dịp Tết với ý nghĩa vượt qua khó khăn. Canh có vị đắng nhẹ, ngọt thanh từ nước dùng.",
  time: "60 phút",
  rating: 4.8,
  thumbnail: require("../assets/images/sm1.jpg"),

  ingredients: [
    { amount: "4 trái", name: "Khổ qua" },
    { amount: "300g", name: "Thịt heo xay" },
    { amount: "50g", name: "Nấm mèo" },
    { amount: "1 muỗng canh", name: "Hành tím băm" },
    { amount: "1/2 muỗng cà phê", name: "Tiêu" }
  ],

  steps: [
    {
      title: "Sơ chế khổ qua",
      content:
        "Khổ qua bổ đôi, lấy hết ruột, rửa sạch. Có thể ngâm nước muối để giảm vị đắng."
    },
    {
      title: "Làm nhân",
      content:
        "Trộn thịt xay với nấm mèo, hành tím, tiêu và gia vị."
    },
    {
      title: "Nấu canh",
      content:
        "Nhồi thịt vào khổ qua, nấu với nước sôi khoảng 30–40 phút."
    }
  ],

  category: "Canh",
  difficulty: "Trung bình",
  cuisine: "Miền Nam",
  calories: 300,
  tags: ["canh", "khổ qua", "truyền thống"]
},

{
  title: "Cơm Tấm Sài Gòn",
  description:
    "Cơm tấm là biểu tượng ẩm thực Sài Gòn với sườn nướng thơm lừng, cơm tấm dẻo mềm, ăn kèm bì, chả trứng và nước mắm chua ngọt.",
  time: "90 phút",
  rating: 5.0,
  thumbnail: require("../assets/images/sm2.jpg"),

  ingredients: [
    { amount: "500g", name: "Gạo tấm" },
    { amount: "400g", name: "Sườn heo" },
    { amount: "2 quả", name: "Trứng gà" },
    { amount: "100g", name: "Bì heo" }
  ],

  steps: [
    {
      title: "Nấu cơm",
      content:
        "Vo gạo tấm, nấu cơm bằng nồi cơm điện."
    },
    {
      title: "Nướng sườn",
      content:
        "Ướp sườn với gia vị, nướng than hoặc áp chảo."
    },
    {
      title: "Hoàn thành",
      content:
        "Xếp cơm, sườn, bì, chả, chan nước mắm."
    }
  ],

  category: "Món chính",
  difficulty: "Trung bình",
  cuisine: "Miền Nam",
  calories: 750,
  tags: ["cơm tấm", "sài gòn", "đặc sản"]
},

{
  title: "Thịt Kho Tiêu",
  description:
    "Thịt kho tiêu là món ăn dân dã của miền Nam, nổi bật với mùi tiêu cay nồng, thịt heo mềm thấm gia vị, nước kho mặn ngọt hài hòa, rất thích hợp cho những bữa cơm gia đình giản dị.",
  time: "60 phút",
  rating: 4.7,
  thumbnail: require("../assets/images/sm3.jpg"),

  ingredients: [
    { amount: "600g", name: "Thịt nạc vai hoặc ba chỉ" },
    { amount: "2 muỗng canh", name: "Nước mắm" },
    { amount: "1 muỗng canh", name: "Đường" },
    { amount: "1 muỗng cà phê", name: "Tiêu xay" },
    { amount: "1 muỗng cà phê", name: "Tiêu hạt đập dập" },
    { amount: "2 tép", name: "Tỏi băm" },
    { amount: "1 củ", name: "Hành tím băm" },
    { amount: "1 trái", name: "Ớt (tùy chọn)" }
  ],

  steps: [
    {
      title: "Sơ chế thịt",
      content:
        "Thịt heo rửa sạch với nước muối loãng, trụng sơ nước sôi để khử mùi hôi, sau đó cắt miếng vừa ăn. Để thịt ráo nước hoàn toàn trước khi ướp."
    },
    {
      title: "Ướp thịt",
      content:
        "Cho thịt vào tô, thêm nước mắm, đường, tỏi băm, hành tím băm, tiêu xay và tiêu hạt đập dập. Trộn đều và ướp khoảng 25–30 phút cho thịt thấm gia vị."
    },
    {
      title: "Xào săn thịt",
      content:
        "Bắc nồi lên bếp, cho thịt đã ướp vào xào trên lửa vừa cho thịt săn lại, ra mỡ và dậy mùi thơm đặc trưng của tiêu."
    },
    {
      title: "Kho thịt",
      content:
        "Thêm khoảng 150–200ml nước lọc hoặc nước dừa vào nồi, đun sôi rồi hạ nhỏ lửa kho trong 30–40 phút. Trong quá trình kho, thỉnh thoảng đảo nhẹ để thịt chín đều và không bị cháy đáy nồi."
    },
    {
      title: "Hoàn thành",
      content:
        "Khi thịt mềm, nước kho sánh lại, nêm nếm lần cuối cho vừa miệng, rắc thêm tiêu xay và ớt cắt lát nếu thích cay. Tắt bếp và dùng nóng với cơm trắng."
    }
  ],

  category: "Món mặn",
  difficulty: "Dễ",
  cuisine: "Miền Nam",
  calories: 600,
  tags: ["thịt kho", "kho tiêu", "nam bộ", "bếp nhà", "cay nhẹ"]
}




];

// --- HÀM UPLOAD ẢNH ---
const uploadImageToSupabase = async (
  localAsset: any,
  fileNamePrefix: string
) => {
  try {
    const assets = await Asset.loadAsync(localAsset);
    const asset = assets[0];

    if (!asset || !asset.localUri) {
      throw new Error("Không thể tải file asset từ localUri.");
    }

    const base64 = await readAsStringAsync(asset.localUri, {
      encoding: "base64",
    });

    const fileExt = "jpg";
    const fileName = `${fileNamePrefix}_${Date.now()}.${fileExt}`;
    const filePath = `recipes/${MY_USER_ID}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return null;
  }
};

// --- HÀM CHÍNH ---
export const seedDataToSupabase = async () => {
  try {
    console.log("🚀 Bắt đầu tiến trình đẩy dữ liệu...");
    Alert.alert("Đang xử lý", "Vui lòng đợi upload ảnh lên Cloud...");

    const recipesToInsert = [];

    for (let i = 0; i < myLocalRecipes.length; i++) {
      const recipe = myLocalRecipes[i];
      console.log(
        `⏳ Đang upload ảnh cho món [${i + 1}/${myLocalRecipes.length}]: ${recipe.title}...`
      );

      const publicUrl = await uploadImageToSupabase(
        recipe.thumbnail,
        `recipe_${i}`
      );

      if (publicUrl) {
        recipesToInsert.push({
          user_id: MY_USER_ID,
          title: recipe.title,
          description: recipe.description,
          time: recipe.time,
          rating: recipe.rating,
          thumbnail: publicUrl,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          // 👇 ĐÃ THÊM CÁC CỘT MỚI VÀO ĐÂY
          category: recipe.category,
          difficulty: recipe.difficulty,
          cuisine: recipe.cuisine,
          calories: recipe.calories,
          tags: recipe.tags
        });
      } else {
        console.warn(`⚠️ Bỏ qua món "${recipe.title}" do lỗi upload ảnh.`);
      }
    }

    if (recipesToInsert.length === 0) {
      Alert.alert("Thất bại", "Không có ảnh nào được upload thành công.");
      return;
    }

    const { error } = await supabase.from("recipes").insert(recipesToInsert);

    if (error) {
      Alert.alert("Lỗi Database", error.message);
    } else {
      Alert.alert("Thành công", `Đã thêm ${recipesToInsert.length} món ăn!`);
    }
  } catch (err: any) {
    console.error("Lỗi:", err);
    Alert.alert("Lỗi", err.message);
  }
};