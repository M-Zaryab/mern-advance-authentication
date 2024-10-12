import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplete.js";
import { transporter } from "./mailtrapConfig.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: "zaryabimran222@gmail.com",
    to: `${email}`,
    subject: "Verification Code | Ecommerce App",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
    category: "Email Verification",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error sending verification mail", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendForgotPasswordEmail = async (email, resetURL) => {
  const mailOptions = {
    from: "zaryabimran222@gmail.com",
    to: `${email}`,
    subject: "Reset Password | Ecommerce App",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    category: "Password Reset",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error sending reset password email", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: "zaryabimran222@gmail.com",
    to: `${email}`,
    subject: "Password Reset Successfull | Ecommerce App",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    category: "Password Reset",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error sending reset password success email", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
