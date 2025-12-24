import { Alert } from "react-native";
import { supabase } from "../config/supabaseClient";
import { Asset } from "expo-asset";
import { decode } from "base64-arraybuffer";
import { readAsStringAsync } from "expo-file-system/legacy";

// ID CỦA BẠN (Bùi Anh Khôi)
const MY_USER_ID = "8ba20fca-d0b3-4672-8e21-ad1468644329";

// --- DỮ LIỆU LOCAL ---
const myLocalRecipes = [
  {
    title: "Bò Kho Bánh Mì",
    description: "Món bò kho đậm đà, thịt mềm tan, chấm cùng bánh mì giòn rụm.",
    time: "90 phút",
    rating: 5.0,
    thumbnail: require("../assets/images/bokho.png"),
    ingredients: [
      { amount: "800g-1kg", name: "Nạm bò, bắp bò" },
      { amount: "2 củ", name: "Cà rốt" },
      { amount: "2 củ", name: "Khoai tây" },
      { amount: "1 củ", name: "Hành tây nhỏ" },
      { amount: "1 ít", name: "ngò gai, húng quế" },
      { amount: "2-3 cây", name: "Sả" },
      { amount: "3-4 tép", name: "Tỏi" },
      { amount: "1/2 muỗng cà phê", name: "Bột nghệ" },
      { amount: "1 chén", name: "Nước mắm, đường, muối, hạt nêm, tiêu xay" },
      { amount: "1 chén", name: "Dầu ăn" },
      { amount: "1-2 muỗng canh", name: "Bột năng/Bột bắp" },
      { amount: "1-2 muỗng canh", name: "Dầu điều" },
      { amount: "1 lon", name: "Nước dừa tươi/Nước lọc" },
      { amount: "1 ổ", name: "bánh mì" },
      { amount: "1 phần", name: "Cơm, hủ tiếu trắng" },
    ],
    steps: [
      {
        title: "Sơ chế",
        content:
          "Rửa sạch thịt bò (có thể chần qua nước sôi với gừng đập dập để khử mùi), cắt miếng vuông vừa ăn (khoảng 3-4cm). Cà rốt, khoai tây gọt vỏ, cắt khúc lớn. Hành tây thái hạt lựu. Sả đập dập, cắt khúc. Gừng, tỏi băm nhỏ. Cho thịt bò vào tô. Thêm bột bò kho, bột nghệ, gừng tỏi băm, nước mắm, đường, hạt nêm, tiêu xay. Trộn đều và để ướp ít nhất 30 phút (hoặc 2 tiếng trong tủ lạnh cho thấm sâu).",
      },
      {
        title: "Xào và hầm thịt",
        content:
        "Bắc nồi/chảo lên bếp, cho dầu ăn và dầu điều vào. Phi thơm sả đập dập và hành tây thái hạt lựu. Cho thịt bò đã ướp vào xào săn lại. Cho nước dừa tươi (hoặc nước lọc) vào ngập mặt thịt. Thêm hoa hồi và quế (nếu dùng). Đun sôi rồi hạ lửa nhỏ nhất, đậy vung, hầm trong khoảng 60 - 90 phút hoặc cho đến khi thịt bò mềm nhừ theo ý muốn. Trong quá trình hầm, thường xuyên vớt bọt.",
      },
        {
        title: "Thêm rau củ và nêm nếm",
        content:
          "Khi thịt bò đã mềm khoảng 70%, cho cà rốt vào hầm tiếp. Sau khoảng 10 phút, cho khoai tây vào. Hòa tan 1-2 muỗng canh bột năng/bột bắp với một ít nước lạnh. Khi các nguyên liệu đã chín mềm, nêm nếm lại gia vị cho vừa miệng. Từ từ đổ chén bột năng đã hòa tan vào nồi, vừa đổ vừa khuấy nhẹ để nước bò kho sánh lại.",
      },  {
        title: "Hoàn thành",
        content:
          "Đun thêm khoảng 2-3 phút cho sốt sôi lại và sánh đều là tắt bếp. Múc bò kho ra tô, rắc tiêu xay và rau thơm (ngò gai, húng quế) thái nhỏ lên trên. Ăn nóng kèm bánh mì, hủ tiếu, hoặc cơm. Phục vụ kèm chén muối ớt chanh hoặc tương ớt để tăng hương vị.",
      }
    ],
  },
];

// --- HÀM UPLOAD ẢNH (ĐÃ FIX CHO SDK 54) ---
const uploadImageToSupabase = async (
  localAsset: any,
  fileNamePrefix: string
) => {
  try {
    // 1. Tải asset từ require
    const assets = await Asset.loadAsync(localAsset);
    const asset = assets[0];

    if (!asset || !asset.localUri) {
      throw new Error("Không thể tải file asset từ localUri.");
    }

    // 2. Đọc file bằng hàm Legacy
    // Lưu ý: Dùng chuỗi 'base64' trực tiếp thay vì EncodingType
    const base64 = await readAsStringAsync(asset.localUri, {
      encoding: "base64",
    });

    // 3. Tạo tên file
    const fileExt = "jpg";
    const fileName = `${fileNamePrefix}_${Date.now()}.${fileExt}`;
    const filePath = `recipes/${MY_USER_ID}/${fileName}`;

    // 4. Upload lên Supabase
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 5. Lấy Link
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
        `⏳ Đang upload ảnh cho món [${i + 1}/${myLocalRecipes.length}]: ${
          recipe.title
        }...`
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
