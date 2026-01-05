import validator from "validator";

// email
export function validatorEmail(
  email: string,
  onError: (errMsg: string) => void
): boolean {
  const val = email.trim();
  if (!val) {
    onError("Không được để trống");
    return false;
  } else if (validator.isEmail(email)) {
    onError("");
    return true;
  } else {
    onError("Email không hợp lệ");
    return false;
  }
}

// email + phone

export function validatorEmailAndPhone(
  valueForm: string,
  onErr: (errMsg: string) => void
) {
  const val = valueForm.trim();
  if (!val) {
    onErr("Không được để trống");
    return false;
  } else if (validator.isEmail(val) || validator.isMobilePhone(val, "vi-VN")) {
    onErr("");
    return true;
  } else {
    onErr("Email hoặc số điện thoại không hợp lệ");
    return false;
  }
}

//pass
export function validatorPasswword(
  pass: string,
  onErr: (errMsg: string) => void
) {
  const val = pass.trim();
  if (!val) {
    onErr("Không được để trống");
    return false;
  } else if (
    validator.isStrongPassword(val, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 2,
      minSymbols: 1,
    })
  ) {
    onErr("");
    return true;
  } else {
    onErr("Mật khẩu gồm: chữ hoa, chữ thường, số và ký tự đặc biệt");
    return false;
  }
}

export function validatorPhone(phone: string, onErr: (errMsg: string) => void) {
  const val = phone.trim();
  if (!val) {
    onErr("Không được để trống");
    return false;
  } else if (validator.isMobilePhone(val, "vi-VN")) {
    onErr("");
    onErr("");
    return true;
  } else {
    onErr("Số điện thoại không hợp lệ");
    return false;
  }
}

interface ValidateStringOptions {
  minLength?: number;
  maxLength?: number;
  onlyAlpha?: boolean;
}

export function validatorString(
  value: string,
  onErr: (errMsg: string) => void,
  options: ValidateStringOptions = {}
): boolean {
  const val = value.trim();

  if (!val) {
    onErr("Không được để trống");
    return false;
  }
  if (
    options.minLength &&
    !validator.isLength(val, { min: options.minLength })
  ) {
    onErr(`Phải có ít nhất ${options.minLength} ký tự`);
    return false;
  }
  if (
    options.maxLength &&
    !validator.isLength(val, { max: options.maxLength })
  ) {
    onErr(`Không được quá ${options.maxLength} ký tự`);
    return false;
  }
  if (options.onlyAlpha && !validator.isAlpha(validator.blacklist(val, " "))) {
    onErr("Chỉ được chứa chữ cái");
    return false;
  }

  // hợp lệ
  onErr("");
  return true;
}

export function validatorPrice(
  price: string,
  onErr: (errMsg: string) => void
): boolean {
  const val = price.trim();

  if (!val) {
    onErr("Giá không được để trống");
    return false;
  }
  if (!validator.isNumeric(val)) {
    onErr("Giá phải là số");
    return false;
  }

  onErr("");
  return true;
}
