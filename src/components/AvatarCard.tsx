import { motion } from 'framer-motion'

type AvatarCardProps = {
  name: string
  subtitle?: string
  imageUrl?: string
  pulse?: boolean
}

function AvatarCard({ name, subtitle, imageUrl, pulse = false }: AvatarCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/5 p-8 text-center">
      <motion.div
        animate={pulse ? { scale: [1, 1.06, 1] } : undefined}
        transition={pulse ? { duration: 1.8, repeat: Infinity } : undefined}
        className="relative mb-4 h-28 w-28 rounded-full border border-white/20 bg-linear-to-br from-[#C7B8FF] to-[#7A5CFF] p-0.75"
      >
        <div className="h-full w-full rounded-full bg-[#0e1427] p-1">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#151b32] text-4xl">
              AI
            </div>
          )}
        </div>
      </motion.div>
      <p className="text-lg font-semibold">{name}</p>
      {subtitle ? <p className="text-sm text-gray-400">{subtitle}</p> : null}
    </div>
  )
}

export default AvatarCard
