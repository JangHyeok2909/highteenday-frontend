import React from "react";
import clsx from "clsx";
import Spinner from "./Spinner";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  /** true면 부모 너비를 꽉 채움 */
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      type = "button",
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          "ui-button",
          `ui-button--${variant}`,
          `ui-button--${size}`,
          fullWidth && "ui-button--full",
          isLoading && "ui-button--loading",
          className
        )}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading && <Spinner size={size === "lg" ? 18 : 14} />}
        <span className="ui-button__label">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
