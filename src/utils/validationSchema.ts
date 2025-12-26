import * as yup from "yup";

// --- 1. Schema Đăng ký ---
export const getRegisterSchema = (t: any) =>
  yup.object().shape({
    fullName: yup
      .string()
      .required(t("validation.required"))
      .min(3, t("validation.min_length", { min: 3 })),
    email: yup
      .string()
      .required(t("validation.required"))
      .email(t("validation.email_invalid")),
    phone: yup
      .string()
      .required(t("validation.required"))
      .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, t("validation.phone_invalid")),
    password: yup
      .string()
      .required(t("validation.required"))
      .min(6, t("validation.password_min", { min: 6 })),
    confirmPassword: yup
      .string()
      .required(t("validation.required"))
      .oneOf([yup.ref("password")], t("validation.password_mismatch")),
  });

// --- 2. Schema Đăng nhập ---
export const getLoginSchema = (t: any) =>
  yup.object().shape({
    email: yup
      .string()
      .required(t("validation.required"))
      .email(t("validation.email_invalid")),
    password: yup.string().required(t("validation.required")),
  });

// --- 3. Schema Tạo công thức ---
export const getRecipeSchema = (t: any) =>
  yup.object().shape({
    title: yup
      .string()
      .required(t("validation.required"))
      .min(3, t("validation.min_length", { min: 3 }))
      .max(100, t("validation.max_length", { max: 100 })),
    description: yup
      .string()
      .required(t("validation.required"))
      .min(10, t("validation.min_length", { min: 10 }))
      .max(500, t("validation.max_length", { max: 500 })),
    time: yup
      .string()
      .required(t("validation.required"))
      // Cập nhật regex để chấp nhận cả tiếng Anh lẫn tiếng Việt
      .matches(/^\d+\s*(phút|giờ|ngày|mins|hours|days)?$/, t("validation.time_format")),
    difficulty: yup.string().required(t("validation.required")),
    category: yup.string().required(t("validation.required")),
    thumbnail: yup.string().required(t("validation.image_required")),
    ingredients: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string(),
          quantity: yup.string().required(t("validation.required")),
          name: yup
            .string()
            .required(t("validation.required"))
            .min(2, t("validation.min_length", { min: 2 })),
        })
      )
      .min(1, t("validation.min_ingredients"))
      .required(t("validation.required")),
    steps: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t("validation.required")),
          content: yup
            .string()
            .required(t("validation.required"))
            .min(10, t("validation.min_length", { min: 10 })),
        })
      )
      .min(1, t("validation.min_steps"))
      .required(t("validation.required")),
  });

// --- 4. Schema Chỉnh sửa hồ sơ ---
export const getProfileSchema = (t: any) =>
  yup.object().shape({
    fullName: yup
      .string()
      .required(t("validation.required"))
      .min(3, t("validation.min_length", { min: 3 })),
    username: yup
      .string()
      .min(3, t("validation.min_length", { min: 3 }))
      .max(20, t("validation.max_length", { max: 20 })),
    bio: yup.string().max(200, t("validation.max_length", { max: 200 })),
    phone: yup
      .string()
      .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, t("validation.phone_invalid")),
  });

// --- 5. Schema Tìm kiếm ---
export const getSearchSchema = (t: any) =>
  yup.object().shape({
    query: yup.string().min(2, t("validation.min_length", { min: 2 })),
    category: yup.string(),
    difficulty: yup.string(),
    time: yup.string(),
  });