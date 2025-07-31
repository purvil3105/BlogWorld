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
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`} // Fixed: className
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