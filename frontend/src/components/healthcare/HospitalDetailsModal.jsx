import { Button, Modal } from '@heroui/react'
import { MapPin } from 'lucide-react'

export default function HospitalDetailsModal({ hospital, isOpen, onOpenChange, accentColor }) {
  const mapsUrl = hospital
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hospital.name}, ${hospital.address || ''}`
      )}`
    : '#'

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
      <Modal.Container size="md">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{hospital?.name}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="space-y-3 text-sm">
            {hospital?.address && (
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{hospital.address}</span>
              </p>
            )}
            {hospital?.note && <p className="text-[var(--color-text-secondary)]">{hospital.note}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close" style={{ color: accentColor }}>
              Close
            </Button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary"
              style={{ backgroundColor: accentColor }}
            >
              Open in Maps
            </a>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
