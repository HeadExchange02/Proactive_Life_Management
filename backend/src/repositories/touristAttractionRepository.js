import { prisma } from '../config/prisma.js'
import { findBestMatch } from '../utils/fuzzyMatch.js'

// Reads the "Tourist attractions" table. It is not part of the Prisma schema, so it is
// queried with raw SQL. The table and column names are looked up from
// information_schema (ignoring case, spaces and underscores), so "Tourist_attractions",
// "Tourist attractions" and "tourist_attractions" all work, as do "Hotel Name" and
// "hotel_name". All methods fail soft (return []) so travel planning still works if
// the table is missing.

const squash = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')
const quote = (id) => `"${String(id).replace(/"/g, '""')}"`
const norm = (s) =>
  String(s || '').toLowerCase().replace(/['".,]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const sqlNorm = (col) =>
  `trim(regexp_replace(regexp_replace(lower(${col}), '[''".,]', '', 'g'), '[^a-z0-9]+', ' ', 'g'))`

const REQUIRED = ['destination', 'location', 'category', 'description']

let schemaCache = null

async function resolveSchema() {
  if (schemaCache) return schemaCache
  try {
    const rows = await prisma.$queryRaw`
      SELECT table_name, column_name FROM information_schema.columns
      WHERE table_schema = 'public'`
    const tableName = rows.find((r) => squash(r.table_name) === 'touristattractions')?.table_name
    if (!tableName) {
      console.log('Tourist attractions table not found; skipping attraction suggestions.')
      return null
    }
    const cols = {}
    for (const r of rows) if (r.table_name === tableName) cols[squash(r.column_name)] = r.column_name
    if (REQUIRED.some((k) => !cols[k])) {
      console.log('Tourist attractions table is missing expected columns:', Object.keys(cols).join(', '))
      return null
    }
    schemaCache = {
      table: `public.${quote(tableName)}`,
      destination: quote(cols.destination),
      location: quote(cols.location),
      category: quote(cols.category),
      description: quote(cols.description),
      features: cols.combinedfeatures ? `lower(coalesce(${quote(cols.combinedfeatures)}, ''))` : `''`,
      hotelName: cols.hotelname ? quote(cols.hotelname) : 'NULL::text',
      hotelRating: cols.hotelrating ? `NULLIF(${quote(cols.hotelrating)}::text, '')::float8` : 'NULL::float8',
      rating: cols.destinationrating ? `NULLIF(${quote(cols.destinationrating)}::text, '')::float8` : 'NULL::float8',
    }
    return schemaCache
  } catch (err) {
    console.log('Tourist attractions schema lookup failed:', err.message)
    return null
  }
}

const mapRow = (r) => ({
  name: r.name,
  location: r.location,
  category: r.category,
  description: r.description,
  rating: r.rating ?? undefined,
  hotel: r.hotel_name ? { name: r.hotel_name, rating: r.hotel_rating ?? undefined } : undefined,
})

export const touristAttractionRepository = {
  async findByDestination(destination, preferences = '', limit = 8) {
    const q = norm(destination)
    if (!q) return []
    const s = await resolveSchema()
    if (!s) return []

    // Preference words ("beach", "tea garden") rank matching attractions first, using the
    // category and the table's keyword column.
    const stop = new Set([
      'and', 'the', 'for', 'with', 'trip', 'want', 'like', 'near', 'some',
      'place', 'places', 'visit', 'best', 'good', 'nice',
    ])
    const wanted = [
      ...new Set(
        norm(preferences)
          .split(' ')
          .filter((w) => w.length > 2 && !stop.has(w))
          .map((w) => w.replace(/(es|s)$/, ''))
          .filter((w) => w.length > 2)
      ),
    ]

    const select = `
      SELECT ${s.destination} AS name, ${s.location} AS location, ${s.category} AS category,
             ${s.description} AS description, ${s.hotelName} AS hotel_name,
             ${s.hotelRating} AS hotel_rating, ${s.rating} AS rating
      FROM ${s.table}`
    const order = `
      ORDER BY (SELECT count(*) FROM unnest($2::text[]) w
                WHERE lower(${s.category}) = w OR ${s.features} LIKE '%' || w || '%') DESC,
               ${s.rating} DESC NULLS LAST, ${s.hotelRating} DESC NULLS LAST, ${s.destination}
      LIMIT $3`
    const search = (text) =>
      prisma.$queryRawUnsafe(
        `${select}
         WHERE ${sqlNorm(s.destination)} LIKE '%' || $1 || '%'
            OR ${sqlNorm(s.location)} LIKE '%' || $1 || '%' ${order}`,
        text, wanted, limit
      )

    try {
      let rows = await search(q)
      if (!rows.length) {
        // Typo tolerance ("coxs bazr"): fuzzy-match against 1-3 word groups of each location.
        const locs = await prisma.$queryRawUnsafe(`SELECT DISTINCT ${s.location} AS location FROM ${s.table}`)
        const grams = new Set()
        for (const { location } of locs) {
          const w = norm(location).split(' ')
          for (let i = 0; i < w.length; i++)
            for (let n = 1; n <= 3 && i + n <= w.length; n++) grams.add(w.slice(i, i + n).join(' '))
        }
        const best = findBestMatch(destination, [...grams], (g) => g)
        if (best) rows = await search(best)
      }
      return rows.map(mapRow)
    } catch (err) {
      console.log('Tourist attractions lookup failed:', err.message)
      return []
    }
  },
}
