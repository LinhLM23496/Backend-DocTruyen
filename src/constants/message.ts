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

  // Các thông điệp tự định nghĩa
  GENERIC_ERROR: 'An error occurred.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  UNAUTHORIZED_ACCESS: 'Unauthorized access. Please log in.',
  FORBIDDEN_ACCESS: "Forbidden access. You don't have permission for this action.",
  RESOURCE_NOT_FOUND: 'Resource not found.',

  // Các thông điệp khác
  WELCOME_MESSAGE: 'Welcome to the application!',
  LOGOUT_SUCCESSFUL: 'Logout successful.',
  LOGIN_SUCCESSFUL: 'Login successful.',
  DELETE_USER_SUCCESS: 'Delete user successfully.',
  UPDATE_USER_SUCCESS: 'Update user successfully.',
  GET_ALL_USERS_SUCCESS: 'Get all users successfully.',
  ACCESS_TOKEN_CREATED: 'Access token created successfully.',
  GET_USER_INFO_SUCCESS: 'Get user information successfully.',
  VALID_REFRESH_TOKEN: 'Valid refresh token.',

  // Books
  GET_ALL_BOOKS_SUCCESS: 'Get all books successfully.',
  GET_BOOK_SUCCESS: 'Get book successfully.',
  BOOK_NOT_EXIST: 'Book does not exist.',
  UPDATE_BOOK_SUCCESS: 'Update book successfully.',
  DELETE_BOOK_SUCCESS: 'Delete book successfully.',

  // Chapters
  GET_ALL_CHAPTERS_SUCCESS: 'Get all chapters successfully.',
  GET_CHAPTER_SUCCESS: 'Get chapter successfully.',
  CHAPTER_ALREADY_EXIST: 'Chapter already exists.',
  CHAPTER_NOT_EXIST: 'Chapter does not exist.',
  UPDATE_CHAPTER_SUCCESS: 'Update chapter successfully.',
  DELETE_CHAPTER_SUCCESS: 'Delete chapter successfully.',

  // Error
  INVALID_EMAIL_PASSWORD: 'Invalid email or password.',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token.',
  ALL_FIELDS_REQUIRED: 'All fields are required.',
  EMAIL_ALREADY_EXIST: 'Email already exists.',
  USER_NOT_EXIST: 'User does not exist.',
  FIELD_ID_REQUIRED: "Field 'id' must have a value.",
  FIELD_BOOKID_REQUIRED: "Field 'bookId' must have a value.",
  FIELD_BOOKID_CHAPERID_REQUIRED: "Fields 'bookId & chapterId' must have a value.",
  FIELD_CHAPTERID_REQUIRED: "Field 'chapterId' must have a value.",
  CHAPTER_NOT_EXIST_IN_BOOK: 'Chapter does not exist in this book.',
  ERROR_OCCURRED_RETRY_LATER: 'An error occurred. Please try again later.'
}

// Sử dụng các hằng số trong mã của bạn
// Ví dụ:
// console.log(Messages.HTTP_401_UNAUTHORIZED);
// console.log(Messages.GENERIC_ERROR);
