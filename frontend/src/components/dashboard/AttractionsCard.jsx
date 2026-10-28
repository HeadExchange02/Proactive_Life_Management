import { MapPin, Star, BedDouble } from 'lucide-react'

export default function AttractionsCard({ title, data, accentColor }) {
  return (
    <div className="card p-5 mt-4 border-l-4" style={{ borderColor: accentColor }}>
      <h3 className="font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.places.map((p, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border-default)] p-4">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold">{p.name}</h4>
              {p.rating ? (
                <span className="flex items-center gap-1 text-sm font-semibold shrink-0" style={{ color: accentColor }}>
                  <Star size={14} fill="currentColor" />
                  {p.rating}
                </span>
              ) : null}
            </div>
            <p className="flex items-center gap-1 text-xs mt-1 text-[var(--color-text-muted)]">
              <MapPin size={12} className="shrink-0" />
              {p.location} · {p.category}
            </p>
            <p className="text-sm mt-2 text-[var(--color-text-secondary)]">{p.description}</p>
            {p.hotel && (
              <p className="flex items-center gap-1.5 text-xs mt-3 text-[var(--color-text-secondary)]">
                <BedDouble size={13} className="shrink-0" />
                Stay: {p.hotel.name}
                {p.hotel.rating ? ` · ${p.hotel.rating}★` : ''}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
