export function ContactItem({ icon, content }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      {icon}
      <p className="text-base">{content}</p>
    </div>
  )
}
