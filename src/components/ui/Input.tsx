import React from "react";
import clsx from "clsx";
import "./Input.css";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 에러 상태 (테두리 색상만; 메시지는 FormField가 담당) */
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx("ui-input", invalid && "ui-input--invalid", className)}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
