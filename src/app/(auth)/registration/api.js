import Cookies from "react-cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Send OTP to Aadhaar number
 */

export const AadhaarSendOtp = async (mobileNo) => {
  const url = `${BASE_URL}registrationSendOtpV1`;

  try {
    const body = JSON.stringify({ mobile_number: mobileNo });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const result = await response.json();

    return result;
  } catch (error) {
    // Log the error if any occurs
    console.error("Error while sending OTP:", error);
    return { success: false, error: "Network error, please try again." };
  }
};

/**
 * Verify OTP with additional details
 */
export const AadhaarVerifyOtp = async (mobileNo, OTP) => {
  try {
    const requestBody = {
      mobile_number: mobileNo,
      otp: OTP
    };



    const response = await fetch(`${BASE_URL}registrationVerifyOtpV1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return { success: false, error: "Network error, please try again." };
  }
};

export const individualRegister = async (
  fullName,
  authPersonMobile,
  altMobileNo,
  maskedAadhaar,
  hashedAadhaar
) => {
  try {
    const response = await fetch(`${BASE_URL}createIndividualProfileV1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        phone_number: authPersonMobile,
        alternate_phone_number: altMobileNo,
        aadhaar_last_4_digits: maskedAadhaar,
        hash_value: hashedAadhaar,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return { success: false, error: "Network error, please try again." };
  }
};
