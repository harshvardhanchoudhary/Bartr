import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import type { ServiceListing } from '@/types/bartr-b'

interface ServiceCardProps {
  listing: ServiceListing
}

export function ServiceCard({ listing }: ServiceCardProps) {
  return (
    <Link href={`/b/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'var(--surf)', border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)', overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(26,24,20,0.06)',
      }}>
        {/* Category header — green tinted */}
        <div style={{
          padding: '7px 12px',
          background: 'var(--gbg)', borderBottom: '1px solid var(--gbd)',
        }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9,
            textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--grn)',
          }}>
            {listing.category}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '10px 12px 12px' }}>
          <h3 style={{
            fontSize: 13, fontWeight: 500, color: 'var(--ink)',
            lineHeight: 1.3, marginBottom: 8,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.title}
          </h3>

          {/* Skills tags */}
          {listing.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
              {listing.skills.slice(0, 3).map((skill: string) => (
                <span key={skill} style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                  padding: '2px 6px', borderRadius: 99,
                  background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Rate */}
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 13,
            fontWeight: 500, color: 'var(--grn)', marginBottom: 8,
          }}>
            {listing.credit_rate}c {listing.credit_unit}
          </div>

          {/* Who */}
          {listing.profile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              paddingTop: 8, borderTop: '1px solid var(--brd)',
            }}>
              <Avatar
                src={listing.profile.avatar_url}
                alt={listing.profile.display_name ?? listing.profile.handle}
                size="sm"
              />
              <span style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.profile.handle}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
