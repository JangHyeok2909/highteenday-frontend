import React, { useId } from "react";
import clsx from "clsx";
import "./FormField.css";

interface FormFieldProps {
  label?: React.ReactNode;
  /** 유효성 에러 메시지 */
  error?: string;
  /** 라벨 아래 보조 설명 */
  hint?: string;
  required?: boolean;
  className?: string;
  /** Input/select 등 단일 폼 컨트롤. id가 없으면 자동 부여해 라벨과 연결 */
  children: React.ReactElement;
}

/** 라벨 + 컨트롤 + 에러 한 줄을 묶는 폼 필드 래퍼 */
export default function FormField({
  label,
  error,
  hint,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const autoId = useId();
  const child = children as React.ReactElement<
    Record<string, unknown> & { id?: string }
  >;
  const controlId = child.props.id ?? autoId;

  return (
    <div className={clsx("ui-form-field", className)}>
      {label && (
        <label className="ui-form-field__label" htmlFor={controlId}>
          {label}
          {required && <span className="ui-form-field__required">*</span>}
        </label>
      )}
      {React.cloneElement(child, {
        id: controlId,
        "aria-invalid": !!error || undefined,
        // 네이티브 태그(select 등)에는 invalid prop을 넘기지 않음 (DOM 경고 방지)
        ...(typeof child.type === "string"
          ? {}
          : { invalid: !!error || (child.props.invalid as boolean | undefined) }),
      })}
      {error ? (
        <p className="ui-form-field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="ui-form-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
