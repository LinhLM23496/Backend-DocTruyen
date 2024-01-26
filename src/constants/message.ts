export const Messages = {
  // Mã trạng thái HTTP
  HTTP_200_OK: 'OK',
  HTTP_201_CREATED: 'Created',
  HTTP_204_NO_CONTENT: 'No Content',
  HTTP_400_BAD_REQUEST: 'Bad Request',
  HTTP_401_UNAUTHORIZED: 'Unauthorized',
  HTTP_403_FORBIDDEN: 'Forbidden',
  HTTP_404_NOT_FOUND: 'Not Found',
  HTTP_500_INTERNAL_SERVER_ERROR: 'Internal Server Error',

  // Các thông điệp khác
  LOGOUT_SUCCESSFUL: 'Đăng xuất thành công rồi! Chúng tôi sẽ nhớ về bạn đó!',
  LOGIN_SUCCESSFUL: 'Đăng nhập thành công rồi! Chào mừng bạn quay trở lại!',
  DELETE_USER_SUCCESS:
    'Xóa người dùng thành công. Chúng tôi ghi nhận tất cả đóng góp của bạn cho chúng tôi! Chân thành cảm ơn bạn! <3',
  UPDATE_USER_SUCCESS: 'Cập nhật thông tin thành công rồi đó!',
  UPDATE_PASSWORD_SUCCESS: 'Chúng tôi đổi cho cái mật khẩu mới rồi đó! Hãy nhớ nó nhé!',
  GET_ALL_USERS_SUCCESS: 'Get all users successfully.',
  ACCESS_TOKEN_CREATED: 'Access token created successfully.',
  GET_USER_INFO_SUCCESS: 'Thông tin người dùng đã được tải về. Hãy nhớ về người đó nhé!',
  VALID_REFRESH_TOKEN: 'Valid refresh token.',
  SENDED_CODE_EMAIL: 'Kiểm tra email của bạn để lấy mã nhé!',

  // Books
  GET_ALL_BOOKS_SUCCESS: 'Get all books successfully.',
  GET_BOOK_SUCCESS: 'Get book successfully.',
  BOOK_NOT_EXIST: 'Chúng tôi "CHẢ" thấy truyện này đâu cả!',
  UPDATE_BOOK_SUCCESS: 'Cập nhật sách thành công. Cập nhật thêm nữa nha!',
  DELETE_BOOK_SUCCESS: 'Xoá sách thành công. Nhưng mà đừng xoá nữa nha!',

  // Chapters
  GET_ALL_CHAPTERS_SUCCESS: 'Get all chapters successfully.',
  GET_CHAPTER_SUCCESS: 'Get chapter successfully.',
  CHAPTER_ALREADY_EXIST: 'Chương này đã tồn tại rồi bạn ơi!',
  CHAPTER_NOT_EXIST: 'Chương này lạ quá, nó không tồn tại trong cuốn truyện này đâu @_@',
  UPDATE_CHAPTER_SUCCESS: 'Cập nhật chương thành công.',
  DELETE_CHAPTER_SUCCESS: 'Xóa chương thành công.',

  // Suggestion
  GET_SUGGESTION_SUCCESS: 'Chúng tôi đã lưu gợi ý của bạn rồi đó! Chờ chúng tôi xử lý nhé!',

  // Error
  INVALID_EMAIL_PASSWORD: 'Sai email hoặc mật khẩu rồi bạn ơi! Ráng nhớ lại đi nào!',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token.',
  ALL_FIELDS_REQUIRED: 'Chúng tôi cần tất cả các trường đó bạn ơi!',
  EMAIL_ALREADY_EXIST: 'Email này đã tồn tại rồi bạn ơi!',
  USER_NOT_EXIST: 'Tôi không thể tìm thấy bạn này ở đâu cả!',
  FIELD_ID_REQUIRED: 'Chúng tôi cần ID đó, gửi cho chúng tôi đi bạn ơi!',
  FIELD_BOOKID_REQUIRED: 'Chúng tôi cần bookId đó, gửi cho chúng tôi đi bạn ơi!',
  FIELD_BOOKID_CHAPERID_REQUIRED: 'Chúng tôi cần bookId và chapterId đó, gửi cho chúng tôi đi bạn ơi!',
  FIELD_CHAPTERID_REQUIRED: 'Chúng tôi cần chapterId đó, gửi cho chúng tôi đi bạn ơi!',
  CHAPTER_NOT_EXIST_IN_BOOK: 'Chương này lạ quá, nó không tồn tại trong cuốn truyện này đâu @_@',
  ERROR_OCCURRED_RETRY_LATER: 'Đã xảy ra lỗi. Bạn ơi! Vui lòng thử lại sau nhé ! <3',
  INVALID_CODE: 'Mã không hợp lệ rồi @_@'
}

// Sử dụng các hằng số trong mã của bạn
// Ví dụ:
// console.log(Messages.HTTP_401_UNAUTHORIZED);
// console.log(Messages.GENERIC_ERROR);
