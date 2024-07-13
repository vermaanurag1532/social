// import React, { useState } from 'react';
// import { auth, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider } from '../../firebase/config/Firebase'; // Adjust the path to your Firebase configuration
// import { TextInput, Button } from '@mantine/core'; // Adjust as per your UI library import

// const PhoneAuth = () => {
//   const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number input
//   const [otp, setOtp] = useState(''); // State for OTP input
//   const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
//   const [verificationId, setVerificationId] = useState(''); // State to store verification ID

//   const requestOTP = async () => {
//     try {
//       if (!phoneNumber.trim()) {
//         throw new Error('Phone number cannot be empty');
//       }

//       // Create a PhoneAuthProvider instance
//       const provider = new PhoneAuthProvider(auth);

//       // Request verification
//       const confirmationResult = await signInWithPhoneNumber(provider, phoneNumber);
//       // signInWithPhoneNumber expects the provider and phoneNumber (string)

//       setVerificationId(confirmationResult.verificationId);
//       setOtpSent(true); // Set otpSent to true indicating OTP has been sent
//     } catch (error) {
//       console.error('Error during signInWithPhoneNumber', error);
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       // Create PhoneAuthCredential with verificationId and OTP
//       const credential = PhoneAuthProvider.credential(verificationId, otp);

//       // Verify OTP
//       await signInWithCredential(auth, credential); // signInWithCredential expects auth and credential
//       alert('Phone number verified!'); // Alert user that phone number has been verified
//     } catch (error) {
//       console.error('Error during OTP verification', error);
//     }
//   };

//   return (
//     <div>
//       <TextInput
//         label="Phone Number"
//         placeholder="+1234567890"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//       />
//       <Button onClick={requestOTP}>Request OTP</Button> {/* Button to request OTP */}

//       {otpSent && (
//         <>
//           <TextInput
//             label="OTP"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <Button onClick={verifyOtp}>Verify OTP</Button> {/* Button to verify OTP */}
//         </>
//       )}
//     </div>
//   );
// };

// export default PhoneAuth; // Export PhoneAuth component
