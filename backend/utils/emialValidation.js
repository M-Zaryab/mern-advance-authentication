export const validateEmail = (email) => {
  const validate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return validate.test(email) ? true : false;
};
