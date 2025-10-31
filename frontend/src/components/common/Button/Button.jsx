"use client"
import "./Button.css"

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button",
  fullWidth = false,
  ...props
}) => {
  const className = `btn btn-${variant} btn-${size} ${fullWidth ? "btn-full-width" : ""} ${disabled ? "btn-disabled" : ""}`

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
