export const validateFullName = (name: string) =>
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s W,']+$/g.test(
    name
  )

export const checkExistEmoji = (text: string) =>
  !/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu.test(
    text
  )

export const validateSpecialCharacter = (password: string) =>
  !/^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]).*$/.test(password)

export const validatePassworByCharacter = (password: string) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()\-=_+;:'",<.>/?[\]{}\\|’»«º`”–»«])\S+$/.test(password)

export const validateSpace = (text: string) => /^\S*$/.test(text)

export const validateTextMinLength = (text: string, length: number) => text?.trim()?.length >= length

export const validateTextMaxLength = (text: string, length: number) => text?.trim()?.length <= length

export const validateEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )

export const validateDisplayName = (v: string): boolean => {
  return (
    validateTextMinLength(v, 6) &&
    validateTextMaxLength(v, 22) &&
    validateSpecialCharacter(v) &&
    checkExistEmoji(v) &&
    validateSpace(v)
  )
}

export const validatePassword = (v: string): boolean => {
  return validateTextMinLength(v, 6) && validateTextMaxLength(v, 20) && checkExistEmoji(v) && validateSpace(v)
}
