type InputFieldProps = {
  label: string
  placeholder: string
  type?: string
}

function InputField({ label, placeholder, type = 'text' }: InputFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-gray-300">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white outline-none transition focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35"
      />
    </label>
  )
}

export default InputField
