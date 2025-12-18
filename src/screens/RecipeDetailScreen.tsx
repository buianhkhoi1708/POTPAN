import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  type ImageSourcePropType,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// --- CONSTANTS ---
const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",
  TEXT: "#333333",
  GRAY_TEXT: "#666666",
  BORDER: "#FF6B6B",
} as const;

const { width } = Dimensions.get("window");

// --- TYPES ---
type Step = { title: string; content: string };
type Recipe = {
  id: string;
  categoryName: string;
  name: string;
  rating: number;
  views: string;
  image: ImageSourcePropType;
  author: { name: string; username: string; avatar: ImageSourcePropType };
  time: string;
  description: string;
  ingredients: string[];
  steps: Step[];
};

// --- 1. BASE DATA (TÊN & ẢNH) ---
// Dùng để hiển thị thông tin cơ bản cho tất cả món
const ALL_FOODS_MAP: Record<string, { name: string; image: ImageSourcePropType; cat: string }> = {
  // 1. Cơm gia đình
  "101": { name: "Gà kho gừng", image: require("../assets/images/gakhogung.png"), cat: "Cơm gia đình" },
  "102": { name: "Gà kho nghệ", image: require("../assets/images/gakhonghe.png"), cat: "Cơm gia đình" },
  "103": { name: "Cơm chiên", image: require("../assets/images/comchien.png"), cat: "Cơm gia đình" },
  "104": { name: "Gà chiên mắm tỏi", image: require("../assets/images/gachien.png"), cat: "Cơm gia đình" },
  "105": { name: "Vịt om sấu", image: require("../assets/images/vitom.png"), cat: "Cơm gia đình" },
  "106": { name: "Gà rô-ti", image: require("../assets/images/garoti.png"), cat: "Cơm gia đình" },
  "107": { name: "Ức gà xào nấm", image: require("../assets/images/ucgaxaonam.png"), cat: "Cơm gia đình" },
  "108": { name: "Thịt kho trứng", image: require("../assets/images/thitkhotrung.png"), cat: "Cơm gia đình" },

  // 2. Đặc sản Việt
  "201": { name: "Phở", image: require("../assets/images/pho.png"), cat: "Đặc sản Việt" },
  "202": { name: "Bún bò", image: require("../assets/images/bunbo.png"), cat: "Đặc sản Việt" },
  "203": { name: "Nem rán", image: require("../assets/images/nemran.png"), cat: "Đặc sản Việt" },
  "204": { name: "Mì quảng", image: require("../assets/images/miquang.png"), cat: "Đặc sản Việt" },
  "205": { name: "Bún đậu mắm tôm", image: require("../assets/images/bundaumamtom.png"), cat: "Đặc sản Việt" },
  "206": { name: "Xôi gà", image: require("../assets/images/xoiga.png"), cat: "Đặc sản Việt" },
  "207": { name: "Cháo lòng", image: require("../assets/images/chaolong.png"), cat: "Đặc sản Việt" },
  "208": { name: "Cơm tấm", image: require("../assets/images/comtam.png"), cat: "Đặc sản Việt" },

  // 3. Tiệc lễ
  "301": { name: "Bò kho", image: require("../assets/images/bokho.png"), cat: "Tiệc lễ" },
  "302": { name: "Súp cua", image: require("../assets/images/supcua.png"), cat: "Tiệc lễ" },
  "303": { name: "Cà ri", image: require("../assets/images/cari.png"), cat: "Tiệc lễ" },
  "304": { name: "Chả giò", image: require("../assets/images/chagio.png"), cat: "Tiệc lễ" },
  "305": { name: "Bò nhúng giấm", image: require("../assets/images/bonhunggiam.png"), cat: "Tiệc lễ" },
  "306": { name: "Lẩu cua đồng", image: require("../assets/images/laucuadong.png"), cat: "Tiệc lễ" },
  "307": { name: "Lẩu Thái", image: require("../assets/images/lauthai.png"), cat: "Tiệc lễ" },
  "308": { name: "Lẩu mắm", image: require("../assets/images/laumam.png"), cat: "Tiệc lễ" },

  // 4. Món nước ngoài
  "401": { name: "Mì Ý", image: require("../assets/images/miy.png"), cat: "Món nước ngoài" },
  "402": { name: "Hamburger", image: require("../assets/images/ham.png"), cat: "Món nước ngoài" },
  "403": { name: "Lasagna", image: require("../assets/images/lasagma.png"), cat: "Món nước ngoài" },
  "404": { name: "Steak", image: require("../assets/images/steak.png"), cat: "Món nước ngoài" },
  "405": { name: "Kimbap", image: require("../assets/images/kimbap.png"), cat: "Món nước ngoài" },
  "406": { name: "Khoai tây nghiền", image: require("../assets/images/khoaitaynghien.png"), cat: "Món nước ngoài" },
  "407": { name: "Ức vịt sốt cam", image: require("../assets/images/ucvitsotcam.png"), cat: "Món nước ngoài" },
  "408": { name: "Gà kem hành", image: require("../assets/images/gakemhanh.png"), cat: "Món nước ngoài" },

  // 5. Chữa lành
  "501": { name: "Súp rau củ", image: require("../assets/images/tauhukho.png"), cat: "Chữa lành" },
  "502": { name: "Giò hầm bí đỏ", image: require("../assets/images/giohambido.png"), cat: "Chữa lành" },
  "503": { name: "Canh bí đao", image: require("../assets/images/canhbidao.png"), cat: "Chữa lành" },
  "504": { name: "Súp gà", image: require("../assets/images/supga.png"), cat: "Chữa lành" },
  "505": { name: "Gà tiềm thuốc", image: require("../assets/images/gatiem.png"), cat: "Chữa lành" },
  "506": { name: "Canh bí hầm sườn", image: require("../assets/images/canhbihamsuon.png"), cat: "Chữa lành" },
  "507": { name: "Chân giò hầm lạc", image: require("../assets/images/changiohamlac.png"), cat: "Chữa lành" },
  "508": { name: "Cháo thịt băm", image: require("../assets/images/chaothitbam.png"), cat: "Chữa lành" },

  // 6. Đồ ăn chay
  "601": { name: "Tàu hũ kho", image: require("../assets/images/tauhukho.png"), cat: "Đồ ăn chay" },
  "602": { name: "Chả giò chay", image: require("../assets/images/chagio.png"), cat: "Đồ ăn chay" },
  "603": { name: "Mít kho", image: require("../assets/images/mitkho.png"), cat: "Đồ ăn chay" },
  "604": { name: "Đậu hũ sốt cà", image: require("../assets/images/dauhusocachua.png"), cat: "Đồ ăn chay" },
  "605": { name: "Củ sen kho", image: require("../assets/images/cusenkho.png"), cat: "Đồ ăn chay" },
  "606": { name: "Sườn non rim", image: require("../assets/images/suonnonchayrim.png"), cat: "Đồ ăn chay" },
  "607": { name: "Chả chay", image: require("../assets/images/chachay.png"), cat: "Đồ ăn chay" },
  "608": { name: "Bì cuốn", image: require("../assets/images/bicuon.png"), cat: "Đồ ăn chay" },

  // 7. Mồi hấp dẫn
  "701": { name: "Đậu tẩm hành", image: require("../assets/images/dautamhanh.png"), cat: "Mồi hấp dẫn" },
  "702": { name: "Nấm rơm xào tỏi", image: require("../assets/images/namromxaotoi.png"), cat: "Mồi hấp dẫn" },
  "703": { name: "Tóp mỡ rim", image: require("../assets/images/topmorim.png"), cat: "Mồi hấp dẫn" },
  "704": { name: "Mực nướng", image: require("../assets/images/mucnuong.png"), cat: "Mồi hấp dẫn" },
  "705": { name: "Nghêu xào", image: require("../assets/images/ngheuxao.png"), cat: "Mồi hấp dẫn" },
  "706": { name: "Chả cá thác lác", image: require("../assets/images/chacathaclac.png"), cat: "Mồi hấp dẫn" },
  "707": { name: "Mề gà xào mướp", image: require("../assets/images/megaxaomuop.png"), cat: "Mồi hấp dẫn" },
  "708": { name: "Gà quay mật ong", image: require("../assets/images/gaquaymatong.png"), cat: "Mồi hấp dẫn" },

  // 8. Mẹ bầu và con
  "801": { name: "Súp gà ngô non", image: require("../assets/images/supgangonon.png"), cat: "Mẹ bầu và con" },
  "802": { name: "Cháo cá chép", image: require("../assets/images/chaocachep.png"), cat: "Mẹ bầu và con" },
  "803": { name: "Canh mọc", image: require("../assets/images/canhmoc.png"), cat: "Mẹ bầu và con" },
  "804": { name: "Cá hồi sốt cam", image: require("../assets/images/cahoisotcam.png"), cat: "Mẹ bầu và con" },
  "805": { name: "Gà hầm sen", image: require("../assets/images/gahamsen.png"), cat: "Mẹ bầu và con" },
  "806": { name: "Lươn xào sả ớt", image: require("../assets/images/luonxaoxaot.png"), cat: "Mẹ bầu và con" },
  "807": { name: "Bò xào nấm", image: require("../assets/images/boxaonam.png"), cat: "Mẹ bầu và con" },
  "808": { name: "Mực xào rau củ", image: require("../assets/images/mucxaoraucu.png"), cat: "Mẹ bầu và con" },
};

// --- 2. CHI TIẾT CÔNG THỨC (FULL DATABASE) ---
const DETAILED_RECIPES: Record<string, Partial<Recipe>> = {
  // === 1. Cơm gia đình ===
  "101": {
    time: "55 phút",
    description: "Món gà kho gừng ấm nồng, thích hợp cho những ngày mưa hoặc tiết trời se lạnh.",
    ingredients: ["500g thịt gà", "50g gừng tươi", "Hành tím, tỏi", "Gia vị: Nước mắm, đường, tiêu"],
    steps: [{ title: "Bước 1:Sơ chế nguyên liệu", content: "Rửa sạch thịt gà (có thể chà xát với muối và gừng đập dập để khử mùi hôi), chặt miếng vừa ăn. Để ráo nước. Gừng cạo vỏ, rửa sạch. Khoảng 2/3 đem thái lát hoặc thái sợi mỏng. 1/3 còn lại đem đập dập, băm nhỏ. Hành khô và tỏi bóc vỏ, băm nhỏ." }, 
      { title: "Bước 2:Ướp gà", content: "Cho thịt gà đã chặt vào tô. Thêm gừng thái sợi/lát, hành/tỏi băm, nước mắm, đường, bột ngọt/hạt nêm, tiêu xay, và 1 muỗng cà phê nước màu (hoặc 1 muỗng cà phê dầu ăn) vào. Trộn đều hỗn hợp và ướp khoảng 20-30 phút cho gà thấm gia vị." },
      { title: "Bước 3:Thắng nước màu", content: "Cho 1-2 muỗng canh đường và một ít nước lọc vào nồi. Đun lửa nhỏ, khuấy đều cho đường tan và chuyển sang màu cánh gián đậm thì thêm nước lọc hoặc nước sôi vào (khoảng 50ml), tắt bếp, để nguội." },
      { title: "Bước 4:Kho gà", content: "Cho một ít dầu ăn vào nồi, phi thơm gừng băm (hoặc hành/tỏi băm). Cho thịt gà đã ướp vào nồi, xào nhanh trên lửa lớn đến khi thịt gà săn lại và hơi xém cạnh. Cho phần nước màu đã thắng (hoặc nước màu đã có sẵn) vào nồi. Đậy vung, hạ lửa nhỏ và kho trong khoảng 20-30 phút. Trong quá trình kho, bạn có thể mở vung, nêm nếm lại gia vị cho vừa miệng và trở mặt thịt để thịt gà thấm đều. Khi nước sốt trong nồi đã cạn, sánh kẹo lại và thịt gà chín mềm, dậy mùi thơm của gừng thì tắt bếp." },
      { title: "Bước 5:Trình bày và hoàn thành", content: "Múc gà kho gừng ra đĩa hoặc để nguyên trong nồi đất. Rắc thêm một chút tiêu xay và hành lá thái nhỏ lên trên. Ăn nóng cùng với cơm trắng." }
    ]
  },
  "102": {
    time: "40 phút",
    description: "Gà kho nghệ vàng ươm đẹp mắt, tốt cho sức khỏe.",
    ingredients: ["500g gà", "2 củ nghệ tươi", "Sả, ớt", "Gia vị thông thường"],
    steps: [{ title: "Bước 1", content: "Sơ chế nghệ tươi" }, { title: "Bước 2", content: "Kho lửa nhỏ cho thấm." }]
  },
  "103": {
    time: "30 phút",
    description: "Cơm chiên dương châu đầy màu sắc.",
    ingredients: ["2 bát cơm nguội", "Trứng gà", "Lạp xưởng", "Đậu hà lan, cà rốt"],
    steps: [{ title: "Bước 1", content: "Chiên lạp xưởng, rau củ." }, { title: "Bước 2", content: "Chiên cơm cùng trứng và hỗn hợp trên." }]
  },
  "104": {
    time: "45 phút",
    description: "Gà chiên mắm tỏi đậm đà, da giòn rụm.",
    ingredients: ["Cánh gà/Đùi gà", "Tỏi băm nhiều", "Nước mắm ngon", "Đường, tiêu"],
    steps: [{ title: "Bước 1", content: "Chiên gà vàng giòn." }, { title: "Bước 2", content: "Sốt mắm tỏi và đảo gà qua." }]
  },
  "105": {
    time: "60 phút",
    description: "Vịt om sấu chua thanh mát ngày hè.",
    ingredients: ["1 con vịt", "10 quả sấu", "Khoai sọ", "Rau rút"],
    steps: [{ title: "Bước 1", content: "Ướp vịt với gia vị." }, { title: "Bước 2", content: "Om vịt với sấu và khoai sọ." }]
  },
  "106": {
    time: "50 phút",
    description: "Gà rô-ti thơm lừng ngũ vị hương.",
    ingredients: ["Đùi gà góc tư", "Ngũ vị hương", "Nước dừa tươi", "Hành tỏi"],
    steps: [{ title: "Bước 1", content: "Ướp gà với ngũ vị hương." }, { title: "Bước 2", content: "Khìa gà với nước dừa." }]
  },
  "107": {
    time: "25 phút",
    description: "Ức gà xào nấm healthy, ít calo.",
    ingredients: ["Ức gà", "Nấm đông cô/nấm rơm", "Hành tây", "Dầu hào"],
    steps: [{ title: "Bước 1", content: "Xào săn ức gà." }, { title: "Bước 2", content: "Thêm nấm và gia vị, đảo nhanh tay." }]
  },
  "108": {
    time: "90 phút",
    description: "Thịt kho tàu mềm rục, chuẩn vị Tết.",
    ingredients: ["Thịt ba chỉ", "Trứng vịt", "Nước dừa", "Nước mắm ngon"],
    steps: [{ title: "Bước 1", content: "Ướp thịt, luộc trứng." }, { title: "Bước 2", content: "Kho thịt với nước dừa đến khi mềm." }]
  },

  // === 2. Đặc sản Việt ===
  "201": {
    time: "3 giờ",
    description: "Phở bò tái chín, quốc hồn quốc túy.",
    ingredients: ["Xương bò hầm", "Bánh phở", "Thịt bò tái/chín", "Quế, hồi, thảo quả"],
    steps: [{ title: "Bước 1: Sơ chế nguyên liệu", content: "Ninh xương bò lấy nước dùng." }, { title: "Bước 2", content: "Trụng phở, xếp thịt, chan nước." }]
  },
  "202": {
    time: "2 giờ",
    description: "Bún bò Huế cay nồng, đậm đà mắm ruốc.",
    ingredients: ["Bún to", "Chân giò", "Thịt bò bắp", "Mắm ruốc Huế"],
    steps: [{ title: "Bước 1", content: "Nấu nước dùng với mắm ruốc và sả." }, { title: "Bước 2", content: "Hoàn thiện tô bún." }]
  },
  "203": {
    time: "60 phút",
    description: "Nem rán (Chả giò) giòn tan.",
    ingredients: ["Thịt xay", "Miến, mộc nhĩ", "Trứng", "Bánh đa nem"],
    steps: [{ title: "Bước 1", content: "Trộn nhân nem." }, { title: "Bước 2", content: "Cuốn và rán vàng." }]
  },
  "204": {
    time: "90 phút",
    description: "Mì Quảng tôm thịt đậm chất miền Trung.",
    ingredients: ["Mì Quảng", "Tôm, thịt ba chỉ", "Trứng cút", "Bánh tráng nướng"],
    steps: [{ title: "Bước 1", content: "Nấu nước nhưng (nước lèo) đậm đặc." }, { title: "Bước 2", content: "Chan ít nước, ăn kèm rau sống." }]
  },
  "205": {
    time: "30 phút",
    description: "Bún đậu mắm tôm chuẩn vị Hà Nội.",
    ingredients: ["Bún lá", "Đậu phụ", "Chả cốm", "Thịt chân giò luộc", "Mắm tôm"],
    steps: [{ title: "Bước 1", content: "Rán đậu, luộc thịt." }, { title: "Bước 2", content: "Pha mắm tôm sủi bọt." }]
  },
  "206": {
    time: "45 phút",
    description: "Xôi gà dẻo thơm, hạt nếp căng mọng.",
    ingredients: ["Gạo nếp cái hoa vàng", "Đùi gà xé", "Hành phi", "Mỡ gà"],
    steps: [{ title: "Bước 1", content: "Đồ xôi dẻo." }, { title: "Bước 2", content: "Làm gà xé phay ăn kèm." }]
  },
  "207": {
    time: "60 phút",
    description: "Cháo lòng nóng hổi, thơm mùi rau thơm.",
    ingredients: ["Gạo tẻ/nếp", "Lòng lợn, dồi, gan", "Huyết (tiết)", "Hành, tía tô"],
    steps: [{ title: "Bước 1", content: "Nấu cháo nhừ." }, { title: "Bước 2", content: "Luộc lòng, thái miếng vừa ăn." }]
  },
  "208": {
    time: "60 phút",
    description: "Cơm tấm sườn bì chả Sài Gòn.",
    ingredients: ["Gạo tấm", "Sườn cốt lết", "Bì heo", "Trứng, chả trứng"],
    steps: [{ title: "Bước 1", content: "Nấu cơm tấm." }, { title: "Bước 2", content: "Nướng sườn, làm bì, hấp chả." }]
  },

  // === 3. Tiệc lễ ===
  "301": { time: "2 giờ", description: "Bò kho bánh mì.", ingredients: ["Thịt bò", "Cà rốt", "Gia vị bò kho"], steps: [{ title: "B1", content: "Kho mềm bò." }] },
  "302": { time: "45 phút", description: "Súp cua khai vị.", ingredients: ["Thịt cua", "Trứng cút", "Bột năng"], steps: [{ title: "B1", content: "Nấu súp sệt." }] },
  "303": { time: "60 phút", description: "Cà ri gà béo ngậy.", ingredients: ["Gà", "Khoai tây", "Cốt dừa", "Bột cà ri"], steps: [{ title: "B1", content: "Nấu cà ri." }] },
  "304": { time: "60 phút", description: "Chả giò hải sản.", ingredients: ["Tôm mực", "Khoai môn", "Sốt mayonnaise"], steps: [{ title: "B1", content: "Cuốn và chiên xù." }] },
  "305": { time: "30 phút", description: "Bò nhúng giấm.", ingredients: ["Thịt bò tái", "Nước giấm", "Rau cuốn"], steps: [{ title: "B1", content: "Pha nước nhúng chua ngọt." }] },
  "306": { time: "60 phút", description: "Lẩu cua đồng thanh mát.", ingredients: ["Cua đồng", "Thịt bò", "Rau lẩu"], steps: [{ title: "B1", content: "Lọc cua nấu nước dùng." }] },
  "307": { time: "45 phút", description: "Lẩu Thái chua cay.", ingredients: ["Hải sản", "Gói lẩu Thái", "Nấm"], steps: [{ title: "B1", content: "Nấu nước lẩu chuẩn vị." }] },
  "308": { time: "60 phút", description: "Lẩu mắm miền Tây.", ingredients: ["Mắm cá linh", "Cà tím", "Hải sản"], steps: [{ title: "B1", content: "Nấu nước cốt mắm." }] },

  // === 4. Món nước ngoài ===
  "401": { time: "30 phút", description: "Mì Ý sốt bò bằm.", ingredients: ["Mì Spaghetti", "Thịt bò xay", "Sốt cà chua"], steps: [{ title: "B1", content: "Luộc mì, làm sốt." }] },
  "402": { time: "30 phút", description: "Hamburger bò.", ingredients: ["Vỏ bánh", "Thịt bò xay", "Phô mai"], steps: [{ title: "B1", content: "Áp chảo thịt, kẹp bánh." }] },
  "403": { time: "60 phút", description: "Lasagna lớp lớp phô mai.", ingredients: ["Lá Lasagna", "Sốt Beshamel", "Phô mai"], steps: [{ title: "B1", content: "Nướng lò." }] },
  "404": { time: "20 phút", description: "Bò bít tết (Steak).", ingredients: ["Thăn bò", "Hương thảo", "Bơ"], steps: [{ title: "B1", content: "Áp chảo độ chín tùy ý." }] },
  "405": { time: "40 phút", description: "Kimbap Hàn Quốc.", ingredients: ["Rong biển", "Cơm", "Xúc xích, trứng"], steps: [{ title: "B1", content: "Cuộn chặt tay." }] },
  "406": { time: "30 phút", description: "Khoai tây nghiền.", ingredients: ["Khoai tây", "Sữa tươi", "Bơ"], steps: [{ title: "B1", content: "Nghiền mịn khoai." }] },
  "407": { time: "50 phút", description: "Ức vịt sốt cam.", ingredients: ["Ức vịt", "Cam vàng", "Mật ong"], steps: [{ title: "B1", content: "Áp chảo vịt, rưới sốt." }] },
  "408": { time: "40 phút", description: "Gà sốt kem nấm.", ingredients: ["Gà", "Kem tươi (Cooking cream)", "Nấm"], steps: [{ title: "B1", content: "Nấu gà với sốt kem." }] },

  // === 5. Chữa lành ===
  "501": { time: "30 phút", description: "Súp rau củ thanh đạm.", ingredients: ["Cà rốt, khoai tây", "Su hào", "Nước dùng rau"], steps: [{ title: "B1", content: "Hầm mềm rau củ." }] },
  "502": { time: "60 phút", description: "Giò hầm bí đỏ bổ dưỡng.", ingredients: ["Chân giò", "Bí đỏ", "Hạt sen"], steps: [{ title: "B1", content: "Hầm chân giò nhừ." }] },
  "503": { time: "30 phút", description: "Canh bí đao giải nhiệt.", ingredients: ["Bí đao", "Tôm khô/thịt băm"], steps: [{ title: "B1", content: "Nấu canh ngọt mát." }] },
  "504": { time: "45 phút", description: "Súp gà nấm.", ingredients: ["Gà xé", "Nấm hương", "Trứng"], steps: [{ title: "B1", content: "Nấu súp sánh." }] },
  "505": { time: "2 giờ", description: "Gà tiềm thuốc bắc.", ingredients: ["Gà ác", "Gói thuốc bắc", "Ngải cứu"], steps: [{ title: "B1", content: "Tần gà cách thủy." }] },
  "506": { time: "45 phút", description: "Canh bí hầm sườn.", ingredients: ["Sườn non", "Bí xanh/đỏ"], steps: [{ title: "B1", content: "Hầm sườn ngọt nước." }] },
  "507": { time: "60 phút", description: "Chân giò hầm lạc.", ingredients: ["Móng giò", "Lạc (đậu phộng)"], steps: [{ title: "B1", content: "Hầm mềm móng giò." }] },
  "508": { time: "40 phút", description: "Cháo thịt băm tía tô.", ingredients: ["Gạo", "Thịt băm", "Tía tô"], steps: [{ title: "B1", content: "Nấu cháo giải cảm." }] },

  // === 6. Đồ ăn chay ===
  "601": { time: "30 phút", description: "Tàu hũ kho nấm.", ingredients: ["Đậu hũ", "Nấm rơm", "Nước tương"], steps: [{ title: "B1", content: "Kho đậu thấm vị." }] },
  "602": { time: "45 phút", description: "Chả giò chay.", ingredients: ["Khoai môn", "Đậu xanh", "Bánh tráng"], steps: [{ title: "B1", content: "Cuốn và chiên giòn." }] },
  "603": { time: "40 phút", description: "Mít non kho chay.", ingredients: ["Mít non", "Nước dừa", "Gia vị chay"], steps: [{ title: "B1", content: "Kho mít mềm." }] },
  "604": { time: "20 phút", description: "Đậu sốt cà chua.", ingredients: ["Đậu hũ", "Cà chua", "Hành lá"], steps: [{ title: "B1", content: "Sốt cà chua đậm đà." }] },
  "605": { time: "40 phút", description: "Củ sen kho tương.", ingredients: ["Củ sen", "Nước tương", "Tiêu"], steps: [{ title: "B1", content: "Kho củ sen giòn sần sật." }] },
  "606": { time: "30 phút", description: "Sườn non chay rim.", ingredients: ["Sườn chay", "Gia vị mặn ngọt"], steps: [{ title: "B1", content: "Chiên và rim sườn." }] },
  "607": { time: "45 phút", description: "Chả lụa chay.", ingredients: ["Tàu hũ ky", "Lá chuối"], steps: [{ title: "B1", content: "Hấp chả." }] },
  "608": { time: "30 phút", description: "Bì cuốn chay.", ingredients: ["Bún", "Rau sống", "Bì chay"], steps: [{ title: "B1", content: "Cuốn chấm nước tương." }] },

  // === 7. Mồi hấp dẫn ===
  "701": { time: "15 phút", description: "Đậu tẩm hành.", ingredients: ["Đậu hũ", "Hành lá", "Nước mắm"], steps: [{ title: "B1", content: "Rán đậu, nhúng mắm hành." }] },
  "702": { time: "15 phút", description: "Nấm xào tỏi.", ingredients: ["Nấm rơm", "Tỏi", "Bơ"], steps: [{ title: "B1", content: "Xào nhanh tay." }] },
  "703": { time: "30 phút", description: "Tóp mỡ rim mắm tỏi.", ingredients: ["Mỡ heo", "Nước mắm", "Tỏi ớt"], steps: [{ title: "B1", content: "Thắng tóp mỡ, rim mắm." }] },
  "704": { time: "20 phút", description: "Mực nướng sa tế.", ingredients: ["Mực tươi/khô", "Sa tế"], steps: [{ title: "B1", content: "Nướng than hoa." }] },
  "705": { time: "15 phút", description: "Nghêu hấp sả/xào.", ingredients: ["Nghêu", "Sả, ớt, rau răm"], steps: [{ title: "B1", content: "Hấp/xào chín tới." }] },
  "706": { time: "30 phút", description: "Chả cá thác lác chiên.", ingredients: ["Cá thác lác", "Thì là"], steps: [{ title: "B1", content: "Quết dẻo và chiên." }] },
  "707": { time: "20 phút", description: "Mề gà xào mướp.", ingredients: ["Mề gà", "Mướp hương"], steps: [{ title: "B1", content: "Xào giòn mề gà." }] },
  "708": { time: "45 phút", description: "Gà nướng mật ong.", ingredients: ["Cánh/đùi gà", "Mật ong"], steps: [{ title: "B1", content: "Nướng vàng óng." }] },

  // === 8. Mẹ bầu và con ===
  "801": { time: "30 phút", description: "Súp gà ngô non.", ingredients: ["Gà", "Ngô ngọt", "Trứng gà"], steps: [{ title: "B1", content: "Nấu súp dễ tiêu." }] },
  "802": { time: "60 phút", description: "Cháo cá chép an thai.", ingredients: ["Cá chép", "Gạo nếp tẻ", "Đậu xanh"], steps: [{ title: "B1", content: "Hầm cháo cá." }] },
  "803": { time: "30 phút", description: "Canh mọc nấu rau củ.", ingredients: ["Giò sống", "Sup lơ/cà rốt"], steps: [{ title: "B1", content: "Nấu canh thanh mát." }] },
  "804": { time: "20 phút", description: "Cá hồi áp chảo sốt cam.", ingredients: ["Phi lê cá hồi", "Cam tươi"], steps: [{ title: "B1", content: "Làm sốt cam, áp chảo cá." }] },
  "805": { time: "60 phút", description: "Gà hầm hạt sen.", ingredients: ["Gà ta", "Hạt sen tươi"], steps: [{ title: "B1", content: "Hầm gà bổ dưỡng." }] },
  "806": { time: "20 phút", description: "Lươn xào sả ớt (ít cay).", ingredients: ["Lươn đồng", "Sả nghệ"], steps: [{ title: "B1", content: "Xào lươn săn thịt." }] },
  "807": { time: "15 phút", description: "Bò xào nấm.", ingredients: ["Thịt bò", "Nấm các loại"], steps: [{ title: "B1", content: "Xào nhanh bò mềm." }] },
  "808": { time: "20 phút", description: "Mực xào rau củ.", ingredients: ["Mực ống", "Cần tây, hành tây"], steps: [{ title: "B1", content: "Xào mực giòn." }] },
};

// --- COMPONENTS ---

// 1. Header
const RecipeHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
  <View style={h.header}>
    <Pressable onPress={onBack} style={h.circleBtn}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </Pressable>
    <Text style={h.title} numberOfLines={1}>{title}</Text>
    <View style={h.rightGroup}>
      <Pressable style={h.circleBtn}>
        <Ionicons name="heart-outline" size={22} color="#fff" />
      </Pressable>
      <Pressable style={h.circleBtn}>
        <Ionicons name="share-social-outline" size={22} color="#fff" />
      </Pressable>
    </View>
  </View>
);

const h = StyleSheet.create({
  header: {
    marginTop: 50,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.BG,
    zIndex: 10,
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.CORAL, flex: 1, textAlign: 'center', marginHorizontal: 10 },
  rightGroup: { flexDirection: 'row', gap: 12 },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.CORAL, alignItems: 'center', justifyContent: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 3.84, elevation: 5,
  }
});

// ... (Các phần code khác giữ nguyên)

// 2. Step Item (Cập nhật: Canh trái)
const StepItem = ({ step }: { step: Step }) => (
  <View style={st.wrapper}>
    {/* Header đỏ bo tròn */}
    <View style={st.headerBadge}>
      <Text style={st.headerText}>{step.title}</Text>
    </View>
    {/* Nội dung bên trong khung viền */}
    <View style={st.contentBox}>
      <Text style={st.contentText}>{step.content}</Text>
    </View>
  </View>
);

const st = StyleSheet.create({
  wrapper: { 
    marginBottom: 25, 
    // ✅ THAY ĐỔI: Canh trái thay vì canh giữa ('center')
    alignItems: 'flex-start' 
  },
  headerBadge: {
    backgroundColor: COLORS.CORAL, 
    paddingHorizontal: 20, 
    paddingVertical: 8,
    borderRadius: 20, 
    zIndex: 1, 
    marginBottom: -15,
    // ✅ THAY ĐỔI: Thêm lề trái để nút không dính sát mép, nhìn đẹp hơn
    marginLeft: 15, 
  },
  headerText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  contentBox: {
    width: '100%', 
    borderWidth: 1.5, 
    borderColor: COLORS.CORAL, 
    borderRadius: 15,
    paddingTop: 25, 
    paddingHorizontal: 15, 
    paddingBottom: 15, 
    backgroundColor: '#fff'
  },
  contentText: { 
    fontSize: 14, 
    color: COLORS.TEXT, 
    lineHeight: 22, 
    textAlign: 'justify' 
  }
});

// ... (Phần Main Screen giữ nguyên)

// --- MAIN SCREEN ---
export default function RecipeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { foodId } = route.params || {};

  // ✅ SMART DATA MERGING
  // Tự động kết hợp dữ liệu cơ bản và dữ liệu chi tiết
  const currentRecipe = useMemo(() => {
    // 1. Lấy Base Info (Tên, Ảnh, Danh mục)
    // Nếu không tìm thấy ID, fallback về 101 để tránh crash
    const baseInfo = ALL_FOODS_MAP[foodId] || ALL_FOODS_MAP["101"];
    
    // 2. Lấy Detail Info (Công thức, Cách làm)
    const detailInfo = DETAILED_RECIPES[foodId];

    // 3. Kết hợp
    return {
      id: foodId,
      categoryName: baseInfo.cat,
      name: baseInfo.name,
      image: baseInfo.image,
      rating: (4 + Math.random()).toFixed(1), // Random rating 4.0 - 5.0
      views: Math.floor(Math.random() * 5000 + 500).toString(),
      author: {
        name: "Đầu Bếp Tài Ba",
        username: "@ChefViet",
        avatar: require("../assets/images/avt.png"), // Dùng chung 1 avatar
      },
      // Nếu có detail thì dùng, không thì hiện nội dung mặc định
      time: detailInfo?.time || "30 phút",
      description: detailInfo?.description || `Món ${baseInfo.name} thơm ngon, bổ dưỡng, rất dễ làm tại nhà.`,
      ingredients: detailInfo?.ingredients || ["Đang cập nhật nguyên liệu..."],
      steps: detailInfo?.steps || [{ title: "Bước 1", content: "Đang cập nhật hướng dẫn..." }]
    };
  }, [foodId]);

  // Logic theo dõi
  const [isFollowing, setIsFollowing] = useState(false);
  const handleToggleFollow = () => setIsFollowing(!isFollowing);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />
      
      <RecipeHeader title={currentRecipe.categoryName} onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        
        {/* --- Hero Image --- */}
        <View style={s.heroContainer}>
          <Image source={currentRecipe.image} style={s.heroImage} resizeMode="cover" />
          <View style={s.playBtnOverlay}>
            <View style={s.playBtnCircle}>
               <Ionicons name="play" size={30} color={COLORS.CORAL} style={{marginLeft: 4}} />
            </View>
          </View>
          <View style={s.infoBar}>
            <Text style={s.dishName}>{currentRecipe.name}</Text>
            <View style={s.ratingContainer}>
              <Ionicons name="star" size={14} color="#fff" />
              <Text style={s.ratingText}> {currentRecipe.rating}</Text>
              <Text style={s.viewsText}> 👁 {currentRecipe.views}</Text>
            </View>
          </View>
        </View>

        {/* --- Author --- */}
        <View style={s.authorSection}>
           <Image source={currentRecipe.author.avatar} style={s.avatar} />
           <View style={s.authorInfo}>
              <Text style={s.authorHandle}>{currentRecipe.author.username}</Text>
              <Text style={s.authorName}>{currentRecipe.author.name}</Text>
           </View>
           <Pressable 
              style={[s.followBtn, isFollowing && s.followingBtn]} 
              onPress={handleToggleFollow}
           >
              <Text style={[s.followText, isFollowing && s.followingText]}>
                {isFollowing ? "Đang theo dõi" : "Theo Dõi"}
              </Text>
           </Pressable>
           <Ionicons name="ellipsis-vertical" size={20} color={COLORS.CORAL} style={{marginLeft: 10}} />
        </View>

        <View style={s.divider} />

        {/* --- Description --- */}
        <View style={s.section}>
            <Text style={s.sectionTitle}>
                Chi Tiết  <Text style={s.timeText}>⏰ {currentRecipe.time}</Text>
            </Text>
            <Text style={s.descText}>{currentRecipe.description}</Text>
        </View>

        {/* --- Ingredients --- */}
        <View style={s.section}>
            <Text style={s.sectionTitle}>Nguyên Liệu</Text>
            {currentRecipe.ingredients.map((ing, index) => (
                <View key={index} style={s.bulletRow}>
                    <Text style={s.bulletPoint}>•</Text>
                    <Text style={s.ingredientText}>{ing}</Text>
                </View>
            ))}
        </View>

        {/* --- Steps --- */}
        <View style={s.section}>
            <Text style={[s.sectionTitle, { marginBottom: 20 }]}>Cách Làm</Text>
            {currentRecipe.steps.map((step, index) => (
                <StepItem key={index} step={step} />
            ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG },
  scrollContent: { paddingBottom: 50 },
  heroContainer: { width: '100%', height: 250, position: 'relative', marginBottom: 15 },
  heroImage: { width: width - 32, height: '100%', borderRadius: 10, marginHorizontal: 16 },
  playBtnOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16 },
  playBtnCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  infoBar: {
    position: 'absolute', bottom: 0, left: 16, right: 16, height: 50,
    backgroundColor: COLORS.CORAL, borderTopLeftRadius: 15, borderTopRightRadius: 15,
    borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20
  },
  dishName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  viewsText: { color: '#fff', fontSize: 14, marginLeft: 5 },
  authorSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' },
  authorInfo: { flex: 1, marginLeft: 10 },
  authorHandle: { color: COLORS.CORAL, fontSize: 12 },
  authorName: { color: COLORS.TEXT, fontWeight: 'bold', fontSize: 16 },
  followBtn: { 
    backgroundColor: COLORS.CORAL, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20,
    minWidth: 100, alignItems: 'center', justifyContent: 'center'
  },
  followText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  followingBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.CORAL },
  followingText: { color: COLORS.CORAL },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15, marginHorizontal: 16 },
  section: { paddingHorizontal: 16, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.CORAL, marginBottom: 10 },
  timeText: { fontSize: 14, fontWeight: 'normal', color: COLORS.CORAL },
  descText: { fontSize: 14, color: COLORS.TEXT, lineHeight: 20 },
  bulletRow: { flexDirection: 'row', marginBottom: 6 },
  bulletPoint: { fontSize: 20, marginRight: 10, lineHeight: 22, color: COLORS.TEXT },
  ingredientText: { fontSize: 14, color: COLORS.TEXT, lineHeight: 22, flex: 1 },
});