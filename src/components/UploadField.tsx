type UploadFieldProps = {
  label: string
  accept?: string
}

function UploadField({ label, accept }: UploadFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="rounded-full border border-dashed border-white/20 bg-white/5 px-5 py-2.5">
        <input
          type="file"
          accept={accept}
          className="w-full cursor-pointer text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#C7B8FF] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#0B1020]"
        />
      </div>
    </label>
  )
}

export default UploadField
