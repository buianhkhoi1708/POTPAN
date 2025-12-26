// src/utils/validationSchema.ts
import * as yup from "yup";

// Schema đăng ký
export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Họ tên không được để trống")
    .min(3, "Họ tên quá ngắn"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không đúng định dạng"),
  phone: yup
    .string()
    .required("SĐT không được để trống")
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
});

// Schema đăng nhập
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng nhập Email")
    .email("Email không đúng định dạng"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu"),
});

// Schema cho công thức nấu ăn
export const recipeSchema = yup.object().shape({
  title: yup
    .string()
    .required("Tên món không được để trống")
    .min(3, "Tên món phải có ít nhất 3 ký tự")
    .max(100, "Tên món quá dài"),
  description: yup
    .string()
    .required("Mô tả không được để trống")
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả quá dài"),
  time: yup
    .string()
    .required("Thời gian không được để trống")
    .matches(/^\d+\s*(phút|giờ|ngày)?$/, "Định dạng thời gian không hợp lệ (VD: 30 phút)"),
  difficulty: yup
    .string()
    .required("Độ khó không được để trống"),
  category: yup
    .string()
    .required("Danh mục không được để trống"),
  thumbnail: yup
    .string()
    .required("Vui lòng chọn ảnh cho món ăn"),
  ingredients: yup
    .array()
    .of(
      yup.object().shape({
        quantity: yup
          .string()
          .required("Số lượng không được để trống"),
        name: yup
          .string()
          .required("Tên nguyên liệu không được để trống")
          .min(2, "Tên nguyên liệu quá ngắn"),
      })
    )
    .min(1, "Cần ít nhất 1 nguyên liệu")
    .required("Nguyên liệu không được để trống"),
  steps: yup
    .array()
    .of(
      yup.object().shape({
        title: yup
          .string()
          .required("Tiêu đề bước không được để trống"),
        content: yup
          .string()
          .required("Nội dung bước không được để trống")
          .min(10, "Nội dung bước quá ngắn"),
      })
    )
    .min(1, "Cần ít nhất 1 bước thực hiện")
    .required("Các bước thực hiện không được để trống"),
});

// Schema cho chỉnh sửa hồ sơ
export const profileSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Họ tên không được để trống")
    .min(3, "Họ tên quá ngắn"),
  username: yup
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(20, "Username quá dài"),
  bio: yup
    .string()
    .max(200, "Bio không được quá 200 ký tự"),
  phone: yup
    .string()
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
});

// Schema cho tìm kiếm
export const searchSchema = yup.object().shape({
  query: yup
    .string()
    .min(2, "Từ khóa tìm kiếm phải có ít nhất 2 ký tự"),
  category: yup.string(),
  difficulty: yup.string(),
  time: yup.string(),
});