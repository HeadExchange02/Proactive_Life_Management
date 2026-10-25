import { prisma } from '../config/prisma.js'
import { logger } from '../config/logger.js'

// Reads the "Hospitals_count_in_Bangladesh" table. It is not part of the Prisma
// schema (columns contain spaces/dots), so it is queried with raw SQL.
// Columns: "Sl. No.", "Organization Name", "Division", "District", "Upazila", "No. of Bed".
// "No. of Bed" is a bigint; it is cast to integer so results stay JSON-serializable.
// All methods fail soft (return empty) so healthcare guidance still works if the
// table is missing or renamed.

const mapRow = (r) => ({
  name: r.name,
  division: r.division,
  district: r.district,
  upazila: r.upazila,
  beds: r.beds,
})

export const hospitalRepository = {
  async findByDistrict(district, limit = 10) {
    const d = String(district || '').trim()
    if (!d) return []
    try {
      const rows = await prisma.$queryRaw`
        SELECT "Organization Name" AS name,
               "Division"          AS division,
               "District"          AS district,
               "Upazila"           AS upazila,
               CAST("No. of Bed" AS integer) AS beds
        FROM public."Hospitals_count_in_Bangladesh"
        WHERE "District" ILIKE ${d}
        ORDER BY "No. of Bed" DESC NULLS LAST
        LIMIT ${limit}`
      return rows.map(mapRow)
    } catch (err) {
      logger.warn({ err }, 'Hospital dataset lookup (district) failed')
      return []
    }
  },

  // The curated specialist hospitals are all in Dhaka, so the name match is
  // restricted to that district; a same-named hospital elsewhere must not lend
  // its bed count to a Dhaka hospital.
  async findByNameKeyword(keyword, district = 'Dhaka') {
    const k = String(keyword || '').trim()
    if (!k) return null
    try {
      const rows = await prisma.$queryRaw`
        SELECT "Organization Name" AS name,
               "Division"          AS division,
               "District"          AS district,
               "Upazila"           AS upazila,
               CAST("No. of Bed" AS integer) AS beds
        FROM public."Hospitals_count_in_Bangladesh"
        WHERE "Organization Name" ILIKE ${'%' + k + '%'}
          AND "District" ILIKE ${district}
        ORDER BY "No. of Bed" DESC NULLS LAST
        LIMIT 1`
      return rows[0] ? mapRow(rows[0]) : null
    } catch (err) {
      logger.warn({ err }, 'Hospital dataset lookup (name) failed')
      return null
    }
  },
}
