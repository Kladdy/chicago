import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export interface RadioOption<T> {
  value: T
  disabled?: boolean 
}

interface Props<T> {
  title: string
  subtitle?: string
  value: RadioOption<T | null>
  setValue: (value: RadioOption<T>) => void
  property: keyof T
  options: RadioOption<T>[]
}

export default function RadioGroupWithDisabledOptions<T>({ title, subtitle, value, setValue, property, options}: Props<T>) {

  return (
    <div>
      <div className="">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          {subtitle}
        </p>
      </div>

      <RadioGroup value={value} onChange={setValue} className="mt-2">
        <RadioGroup.Label className="sr-only"> Välj </RadioGroup.Label>
        <div className="grid grid-cols-3 gap-2">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.value[property] as any}
              value={option}
              className={({ active, checked }) =>
                classNames(
                  !option.disabled ? 'cursor-pointer focus:outline-none' : 'opacity-25 cursor-not-allowed',
                  active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                  option.value === value.value
                    ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                  'border rounded-md py-3 px-1 flex items-center justify-center text-sm font-medium uppercase '
                )
              }
              disabled={option.disabled}
            >
              <RadioGroup.Label as="span">{option.value[property] as any}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
