import { useQuery } from "@tanstack/react-query"
import { interestsApi } from "../lib/api"
import { formatDate } from "../lib/utils"
import { Sparkles } from "lucide-react"

function InterestsPage() {

  const { data, isLoading } = useQuery({
    queryKey: ["interests"],
    queryFn: interestsApi.getAll
  })

  const interests = data?.interests || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Interests</h1>
        <p className="text-base-content/70 mt-1">
          {interests.length} {interests.length === 1 ? "lead" : "leads"} — customers who expressed interest
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : interests.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <Sparkles className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-xl font-semibold mb-2">No interests yet</p>
              <p className="text-sm">Leads will appear here when customers click Interested</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Price</th>
                    <th>Qty Interested</th>
                    <th>Source</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {interests.map(interest => (
                    <tr key={interest._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-xl">
                              <img src={interest.image} alt={interest.name} className="object-cover" />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold line-clamp-1">{interest.name}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <p className="font-medium">
                            {interest.user?.firstName} {interest.user?.lastName}
                          </p>
                          <p className="text-sm opacity-60">{interest.user?.email}</p>
                        </div>
                      </td>

                      <td>
                        <span className="font-semibold">₹{interest.price}</span>
                      </td>

                      <td>
                        <span className="badge badge-neutral font-bold">
                          ×{interest.quantity}
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${interest.source === "cart" ? "badge-secondary" : "badge-primary"}`}>
                          {interest.source === "cart" ? "From Cart" : "Product Page"}
                        </span>
                      </td>

                      <td>
                        <span className="text-sm opacity-60">{formatDate(interest.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterestsPage
