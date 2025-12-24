// src/utils/validationSchema.ts
import * as yup from "yup";

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
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp') // Tự động so sánh với password
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng nhập Email")
    .email("Email không đúng định dạng"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu"),
});