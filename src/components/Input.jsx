import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label, 
    type = "text",
    className = "", // Fixed: was "classname"
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full'>
            {label && (
                <label
                    className='inline-block mb-1 pl-1' 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`w-full px-5 py-3.5 rounded-[14px] bg-white border border-[var(--color-border-light)] focus:outline-none focus:border-[var(--color-primary-text)] transition-colors placeholder:text-[var(--color-secondary-text)] placeholder:font-light font-body text-sm ${className}`}
                ref={ref}
                {...props}
                id={id} 
            />
        </div>
    )
})

export default Input // Fixed: capitalized export