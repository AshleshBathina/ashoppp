import useProducts from "../hooks/useProducts"
import useWishlist from "../hooks/useWishlist"
import { Settings2, Search, LayoutGrid, Handbag, Trophy, LibraryBig, MonitorSmartphone, Star, Heart, Plus, Check, SlidersHorizontal } from "lucide-react"

import PageLoader from "../components/PageLoader"
import { useMemo, useState } from "react"
import useCart from "../hooks/useCart"



const categories = [
  {
    id: 'ALL',
    title: 'All',
    icon: <LayoutGrid className="size-7" />
  },
  {
    id: 'ELECTRONICS',
    title: 'Electronics',
    icon: <MonitorSmartphone className="size-7" />
  },
  {
    id: 'FASHION',
    title: 'Fashion',
    icon: <Handbag className="size-7" />
  },
  {
    id: 'SPORTS',
    title: 'Sports',
    icon: <Trophy className="size-7" />
  },
  {
    id: 'BOOKS',
    title: 'Books',
    icon: <LibraryBig className="size-7" />
  }

]

const HomePage = () => {
  const { isAddingToWishlist, isRemovingFromWishlist, isInWishlist, toggleWishlist } = useWishlist()

  const { isInCart, toggleCart } = useCart()

  const [selectedCategory, handleSelectedCategory] = useState(categories[0].title)
  const [searchQuery, handleSearchQuery] = useState('')

  const updateSearchQuery = event => {
    event.preventDefault()

    handleSearchQuery(event.target.value)
  }

  const updateCategory = categoryTitle => {
    handleSelectedCategory(categoryTitle)
  }

  const { data: productsData, isLoading, isError, isPending, isFetching } = useProducts();


  const filteredProducts = useMemo(() => {
    if (!productsData) return []

    let filtered = productsData

    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return filtered

  }, [productsData, selectedCategory, searchQuery])

  if (isError) return null

  return (
    <div className="flex flex-col min-h-screen h-full bg-[#0F0F0F]">

      {/* ──────────── MOBILE LAYOUT (unchanged) ──────────── */}
      <div className="md:hidden pt-7">
        <div className="flex justify-between px-7">
          <div className="">
            <h1 className="font-bold text-white text-2xl">Products Page</h1>
            <p className="text-[#9CA3AF] text-xs">Vast categories of products</p>
          </div>
          <button className="bg-[#1A1A1A] p-4 rounded-4xl">
            <Settings2 className="size-5 text-white" />
          </button>
        </div>
        <div className="px-7 mt-5">
          <div className="flex items-center bg-[#222222] gap-3 rounded-2xl px-4">
            <Search className="text-[#8A8A8A] text-sm" />
            <input className="py-4 w-full outline-none text-white placeholder:text-[#8A8A8A]" placeholder="Search for products..." type="search" value={searchQuery} onChange={updateSearchQuery} />
          </div>
        </div>

        <ul className="flex items-center px-7 mt-3 no-scrollbar gap-3">
          {categories.map((category) => (
            <li key={category.id} className={`first-child bg-[#222222] text-gray-300 flex justify-center items-center ${selectedCategory === category.title ? 'bg-green-500 text-slate-900' : 'hover:bg-[#313131]'} rounded-2xl`}>
              <button className="w-14.5 p-4 flex justify-center items-center cursor-pointer h-full" onClick={() => updateCategory(category.title)}>
                {category.icon}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-between items-center px-7">
          <h1 className="text-white text-lg font-semibold">Products</h1>
          <p className="text-[#9ca3afb8] text-xs">{filteredProducts?.length || 0} products</p>
        </div>

        {
          (isPending || isFetching) ? <PageLoader /> : (
            <ul className="px-7 mt-2 flex flex-wrap gap-4 pb-24">
              {filteredProducts.map((product) => (
                <li key={product._id} className="w-40 h-65 rounded-2xl">
                  <div className="h-33 rounded-t-2xl relative overflow-hidden flex justify-center items-center">
                    <img className="w-full h-full" src={product.images[0]} />
                    <button className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm size-9 rounded-3xl flex justify-center items-center" disabled={isAddingToWishlist.isPending || isRemovingFromWishlist.isPending} onClick={() => toggleWishlist(product._id)}>
                      <Heart className={`size-5  ${isInWishlist(product._id) ? 'fill-red-400 text-red-400' : 'text-white'}`} />
                    </button>
                  </div>

                  <div className="bg-[#1F1F1F] h-32 rounded-b-2xl p-3">
                    <p className="text-[10px] text-neutral-400 mb-1" >{product.category}</p>
                    <h1 className="line-clamp-1 text-xs mb-1 font-medium text-white">{product.name}</h1>
                    <p className="flex text-sm gap-1 items-center text-white text-[10px]"><Star className="fill-amber-300 size-3 text-amber-400" />{product.averageRating}<span className="text-neutral-400">{`(${product.totalReviews})`}</span></p>

                    <div className="mt-3 flex w-full items-center justify-between">
                      <p className="text-green-400 font-bold text-md">₹{product.price}</p>
                      <button className="rounded-2xl p-1 bg-green-400" onClick={() => toggleCart(product._id)}>
                        {isInCart(product._id) ? <Check className="text-black size-5" /> : <Plus className="text-black size-5" />}
                      </button>
                    </div>
                  </div>


                </li>
              ))}
            </ul>
          )
        }
      </div>

      {/* ──────────── DESKTOP LAYOUT ──────────── */}
      <div className="hidden md:flex flex-col h-full min-h-screen">

        {/* Top header bar */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-[#1A1A1A] bg-[#0F0F0F] sticky top-0 z-10">
          <div>
            <h1 className="font-bold text-white text-3xl">Products</h1>
            <p className="text-[#6B7280] text-sm mt-0.5">Browse our vast catalog</p>
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-[#1A1A1A] gap-3 rounded-2xl px-5 py-3 w-96 border border-[#2A2A2A] focus-within:border-green-500/50 transition-colors">
            <Search className="text-[#6B7280] size-4 shrink-0" />
            <input
              className="w-full bg-transparent outline-none text-white placeholder:text-[#6B7280] text-sm"
              placeholder="Search for products..."
              type="search"
              value={searchQuery}
              onChange={updateSearchQuery}
            />
          </div>

          <button className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 rounded-xl text-[#9CA3AF] hover:text-white hover:border-green-500/30 transition-all text-sm">
            <SlidersHorizontal className="size-4" />
            <span>Filters</span>
          </button>
        </header>

        <div className="flex flex-col flex-1">

          {/* Horizontal category filter bar */}
          <div className="px-8 py-4 border-b border-[#1A1A1A] flex items-center gap-2 flex-wrap">
            {categories.map((category) => {
              const active = selectedCategory === category.title
              return (
                <button
                  key={category.id}
                  onClick={() => updateCategory(category.title)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
                    ${active
                      ? 'bg-green-500/15 text-green-400 border-green-500/25'
                      : 'text-[#9CA3AF] bg-[#1A1A1A] border-[#2A2A2A] hover:text-white hover:border-[#3A3A3A]'
                    }`}
                >
                  <span className={`${active ? 'text-green-400' : 'text-[#555]'} transition-colors`}>
                    {category.id === 'ALL' && <LayoutGrid className="size-4" />}
                    {category.id === 'ELECTRONICS' && <MonitorSmartphone className="size-4" />}
                    {category.id === 'FASHION' && <Handbag className="size-4" />}
                    {category.id === 'SPORTS' && <Trophy className="size-4" />}
                    {category.id === 'BOOKS' && <LibraryBig className="size-4" />}
                  </span>
                  {category.title}
                </button>
              )
            })}
          </div>

          {/* Main product grid */}
          <main className="flex-1 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-lg">{selectedCategory}</p>
                <span className="bg-[#1F1F1F] text-[#9CA3AF] text-xs px-2.5 py-0.5 rounded-full border border-[#2A2A2A]">
                  {filteredProducts?.length || 0} items
                </span>
              </div>
            </div>

            {(isPending || isFetching) ? (
              <PageLoader />
            ) : (
              <ul className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {filteredProducts.map((product) => (
                  <li key={product._id} className="rounded-2xl bg-[#161616] border border-[#222222] hover:border-green-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 overflow-hidden group">
                    <div className="h-48 relative overflow-hidden">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={product.images[0]} alt={product.name} />
                      {/* Wishlist */}
                      <button
                        className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm size-9 rounded-full flex justify-center items-center hover:bg-black/70 transition-colors"
                        disabled={isAddingToWishlist.isPending || isRemovingFromWishlist.isPending}
                        onClick={() => toggleWishlist(product._id)}
                      >
                        <Heart className={`size-4 ${isInWishlist(product._id) ? 'fill-red-400 text-red-400' : 'text-white'}`} />
                      </button>
                      {/* Category badge */}
                      <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[10px] text-neutral-300 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h2 className="line-clamp-2 text-sm font-medium text-white leading-snug mb-2">{product.name}</h2>
                      <p className="flex gap-1 items-center text-[11px] text-neutral-400 mb-3">
                        <Star className="fill-amber-300 size-3 text-amber-400" />
                        <span className="text-white">{product.averageRating}</span>
                        <span>{`(${product.totalReviews} reviews)`}</span>
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-green-400 font-bold text-base">₹{product.price}</p>
                        <button
                          className={`rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all duration-200
                            ${isInCart(product._id)
                              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                              : 'bg-green-400 text-black hover:bg-green-300'
                            }`}
                          onClick={() => toggleCart(product._id)}
                        >
                          {isInCart(product._id) ? <><Check className="size-3.5" />Added</> : <><Plus className="size-3.5" />Add</>}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </main>
        </div>
      </div>

    </div >
  )
}

export default HomePage