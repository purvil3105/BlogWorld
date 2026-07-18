import React, { useId } from 'react'

const Select = React.forwardRef(function Select({
    options,
    label,
    className = "", // Fixed: was "classname"
    ...props // Fixed: was "Props"
}, ref) {
    const id = useId();
    return (
        <div className='w-full'>
            {label && (
                <label htmlFor={id} className='inline-block mb-1 pl-1'> {/* Fixed: added label text and styling */}
                    {label}
                </label>
            )}
            <select 
                {...props} 
                id={id}
                ref={ref}
                className={`w-full px-5 py-3.5 rounded-[14px] bg-white border border-[var(--color-border-light)] focus:outline-none focus:border-[var(--color-primary-text)] transition-colors font-body text-sm ${className}`}
            >
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
})

export default Select