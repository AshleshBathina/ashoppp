import { ChevronLeft, ChevronRight } from "lucide-react"

const ImageCarousel = ({ images, productName }) => {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] group">
      <img
        key={current}
        src={images[current]}
        alt={`${productName} ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>
          <button
            onC lick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
          >
            <ChevronRight className="size-5 text-white" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all cursor-pointer ${i === current ? "w-5 h-2 bg-white" : "size-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageCarousel