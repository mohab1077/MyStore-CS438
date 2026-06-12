import React, { useState } from "react";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useSendCode } from "../features/users/hooks/useSendCode";
import { useChangePassword } from "../features/users/hooks/useChangePassword";
import { useConfirmCode } from "../features/users/hooks/useConfirmCode";


export default function PasswordResetFlow() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const {login ,logout} = useAuth()
  const navigate = useNavigate();

  const { mutate: sendCodeMutate, isPending: isSending } = useSendCode();
  const { mutate: confirmCodeMutate, isPending: isConfirming } =
    useConfirmCode();
  const { mutate: changePasswordMutate, isPending: isChanging } =
    useChangePassword();

  const emailValid = /.+@.+\..+/.test(email);
  const codeValid = /^\d{6}$/.test(code);
  const passValid = pass1.length >= 6 && pass1 === pass2;

  const fieldStyle =
    "w-full rounded-md border border-zinc-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-zinc-400";

  const getErrorMessage = (error: any) => {
    return (
      error?.response?.data?.msg ||
      error?.response?.data ||
      "Something went wrong"
    );
  };

  const handleSendCode = () => {
    sendCodeMutate(
      { email },
      {
        onSuccess: (data: any) => {
          toast.success(data?.msg || data || "Code sent successfully");
          setStep(1);
        },
        onError: (error: any) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleConfirmCode = () => {
    confirmCodeMutate(
      { email, code },
      {
        onSuccess: (data: any) => {
          login(data?.msg)
          setStep(2);
        },
        onError: (error: any) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleChangePassword = () => {
    changePasswordMutate(
      {
        password: pass1,
      },
      {
        onSuccess: (data: any) => {
          toast.success(data?.msg || data || "Password changed successfully");
          logout()
          setStep(3);
        },
        onError: (error: any) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const PrimaryButton = ({
    disabled,
    children,
    onClick,
  }: {
    disabled: boolean;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`mt-4 w-full rounded-md px-4 py-3 text-sm font-semibold transition ${
        disabled
          ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
          : "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h1 className="mb-2 text-2xl font-bold text-zinc-900">
              Forgot password?
            </h1>

            <p className="mb-6 max-w-xs text-center text-sm text-zinc-600">
              Enter your email and we'll send you a code to reset your password.
            </p>

            <input
              type="email"
              placeholder="Email"
              className={fieldStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PrimaryButton
              disabled={!emailValid || isSending}
              onClick={handleSendCode}
            >
              {isSending ? "Sending..." : "Send Email"}
            </PrimaryButton>
          </>
        );

      case 1:
        return (
          <>
            <h1 className="mb-2 text-2xl font-bold text-zinc-900">
              Check your email
            </h1>

            <p className="mb-6 max-w-xs text-center text-sm text-zinc-600">
              Enter the 6-digit code we just emailed you.
            </p>

            <input
              type="text"
              placeholder="123456"
              maxLength={6}
              className={`${fieldStyle} text-center tracking-widest`}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            />

            <PrimaryButton
              disabled={!codeValid || isConfirming}
              onClick={handleConfirmCode}
            >
              {isConfirming ? "Verifying..." : "Verify Code"}
            </PrimaryButton>

            <button
              className="mt-6 text-sm font-medium text-purple-600 hover:underline"
              onClick={() => setStep(0)}
            >
              Back
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h1 className="mb-2 text-2xl font-bold text-zinc-900">
              Reset password
            </h1>

            <p className="mb-6 max-w-xs text-center text-sm text-zinc-600">
              Enter your new password.
            </p>

            <input
              type="password"
              placeholder="Enter new password"
              className={fieldStyle}
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm new password"
              className={`${fieldStyle} mt-3`}
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
            />

            <PrimaryButton
              disabled={!passValid || isChanging}
              onClick={handleChangePassword}
            >
              {isChanging ? "Saving..." : "Reset Password"}
            </PrimaryButton>
          </>
        );

      case 3:
        return (
          <>
            <h1 className="mb-2 text-2xl font-bold text-zinc-900">
              Password Reset Successful
            </h1>

            <p className="mb-6 max-w-xs text-center text-sm text-zinc-600">
              Your password has been updated. You can now log in with your new
              password.
            </p>

            <button
              className="text-sm font-medium text-purple-600 hover:underline"
              onClick={() => {
                setStep(0);
                setEmail("");
                setCode("");
                setPass1("");
                setPass2("");
                 navigate("/");

              }}
            >
              Back to log in
            </button>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center text-center">
        {renderStep()}
      </div>
    </div>
  );
}