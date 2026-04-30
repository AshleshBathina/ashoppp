import { Star } from "lucide-react"

const StarRating = ({ rating, size = "size-4" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`${size} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/20"}`}
      />
    ))}
  </div>
)

export default StarRating