'use client'

import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface Props {
    viewsData: { date: string; views: number }[]
    inquiriesData: { date: string; inquiries: number }[]
    listingsByType: { listingType: string; _count: number }[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const LISTING_TYPE_LABELS: Record<string, string> = {
    sale: 'Vendita',
    rent_long: 'Affitto lungo',
    rent_short: 'Affitto breve',
    room: 'Camere',
}

export function DashboardCharts({ viewsData, inquiriesData, listingsByType }: Props) {
    const pieData = listingsByType.map((item) => ({
        name: LISTING_TYPE_LABELS[item.listingType] || item.listingType,
        value: item._count,
    }))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Grafico visualizzazioni */}
            <div className="lg:col-span-2 bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold">Visualizzazioni ultimi 30 giorni</h3>
                        <p className="text-sm text-gray-500">Andamento giornaliero dei tuoi annunci</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).getDate().toString()}
                            stroke="#9ca3af"
                            fontSize={12}
                        />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                            labelFormatter={(date) =>
                                new Date(date).toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                })
                            }
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '12px',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Visualizzazioni"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Grafico richieste */}
            <div className="bg-white rounded-xl border p-6">
                <div className="mb-4">
                    <h3 className="font-semibold">Richieste ultimi 30 giorni</h3>
                    <p className="text-sm text-gray-500">Numero di contatti ricevuti</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={inquiriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).getDate().toString()}
                            stroke="#9ca3af"
                            fontSize={12}
                        />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                            labelFormatter={(date) =>
                                new Date(date).toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                })
                            }
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '12px',
                            }}
                        />
                        <Bar dataKey="inquiries" fill="#10b981" radius={[4, 4, 0, 0]} name="Richieste" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Grafico a torta */}
            <div className="bg-white rounded-xl border p-6">
                <div className="mb-4">
                    <h3 className="font-semibold">Distribuzione annunci</h3>
                    <p className="text-sm text-gray-500">Per tipologia</p>
                </div>
                {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                label={(entry) => entry.name}
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[280px] flex items-center justify-center text-gray-400">
                        Nessun annuncio pubblicato
                    </div>
                )}
            </div>
        </div>
    )
}