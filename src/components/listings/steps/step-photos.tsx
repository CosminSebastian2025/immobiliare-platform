'use client'

import { useCallback } from 'react'
import { ListingFormData } from '../listing-form-wizard'
import { Upload, X, Star, Image } from 'lucide-react'

interface Props {
    data: ListingFormData
    onChange: (data: Partial<ListingFormData>) => void
}

export function StepPhotos({ data, onChange }: Props) {
    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            const files = Array.from(e.dataTransfer.files).filter((f) =>
                f.type.startsWith('image/')
            )
            onChange({ photos: [...data.photos, ...files].slice(0, 20) })
        },
        [data.photos, onChange]
    )

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        onChange({ photos: [...data.photos, ...files].slice(0, 20) })
    }

    const removePhoto = (index: number) => {
        const newPhotos = data.photos.filter((_, i) => i !== index)
        onChange({
            photos: newPhotos,
            coverPhotoIndex:
                data.coverPhotoIndex === index
                    ? 0
                    : data.coverPhotoIndex > index
                        ? data.coverPhotoIndex - 1
                        : data.coverPhotoIndex,
        })
    }

    const setCover = (index: number) => {
        onChange({ coverPhotoIndex: index })
    }

    return (
        <div className="space-y-6">
            {/* Area upload */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors"
            >
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="font-medium mb-1">Trascina le foto qui</p>
                <p className="text-sm text-gray-500 mb-4">oppure</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                    <Upload className="h-4 w-4" />
                    Seleziona foto
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>
                <p className="text-xs text-gray-400 mt-3">
                    Max 20 foto · JPG, PNG, WebP · Max 10MB per foto
                </p>
            </div>

            {/* Anteprime */}
            {data.photos.length > 0 && (
                <div>
                    <p className="text-sm font-medium mb-3">
                        {data.photos.length} foto caricate ·{' '}
                        <span className="text-gray-500">Clicca sulla stella per impostare la copertina</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {data.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full aspect-[4/3] object-cover rounded-lg"
                                />

                                {/* Badge copertina */}
                                {data.coverPhotoIndex === index && (
                                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Copertina
                  </span>
                                )}

                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCover(index)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                        title="Imposta come copertina"
                                    >
                                        <Star className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 text-red-600"
                                        title="Rimuovi"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggerimenti */}
            <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-medium text-blue-800 mb-2">💡 Consigli per foto efficaci</p>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Usa luce naturale e scatta in orizzontale</li>
                    <li>• Includi tutte le stanze principali</li>
                    <li>• La prima foto è la copertina: scegli la migliore</li>
                    <li>• Evita foto sfocate o troppo scure</li>
                </ul>
            </div>
        </div>
    )
}