import type { ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const buttonVariants = cva(
  "flex gap-1 items-center justify-center rounded-md text-sm cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        fill: "bg-zinc-800 text-white border border-zinc-800 hover:bg-zinc-700",
        ghost: "bg-transparent text-zinc-800 border border-zinc-400 hover:bg-zinc-100",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: React.ReactNode
    text: string
  }

function Button({ icon, text, variant, size, className, ...rest }: ButtonProps) {
  return (
    <button className={twMerge(buttonVariants({ variant, size }), className)} {...rest}>
      {icon && icon}
      {text}
    </button>
  )
}

export default Button