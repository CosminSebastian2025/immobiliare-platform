import { Eye, MessageSquare, Heart, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Props {
    listings: any[]
}

export function PerformanceOverview({ listings }: Props) {
    if (listings.length === 0) return null

    return (
        <div className="bg-white rounded-xl border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Top 5 annunci per performance
                    </h3>
                    <p className="text-sm text-gray-500">I tuoi annunci più visualizzati</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Annuncio</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Località</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Views</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Tasso</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listings.map((listing, index) => (
                        <tr key={listing.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-3 px-2">
                                <Link
                                    href={`/listing/${listing.slug}`}
                                    className="font-medium hover:text-blue-600 flex items-center gap-2"
                                >
                                    <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                                    {listing.title}
                                </Link>
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-600">
                                {listing.address?.city || '-'}
                            </td>
                            <td className="py-3 px-2 text-right">
                                <span className="flex items-center justify-end gap-1">
                                    <Eye className="h-4 w-4 text-gray-400" />
                                    {listing.views}
                                </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    {Math.round((listing.views / (listing.views + 10)) * 100)}%
                                </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}