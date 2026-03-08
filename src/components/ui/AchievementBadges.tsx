import type { Profile } from '@/types'

interface Achievement {
  id: string
  label: string
  description: string
  icon: string
  earned: boolean
  color: 'red' | 'green' | 'gold' | 'blue'
}

function getAchievements(profile: Profile): Achievement[] {
  return [
    {
      id: 'first_trade',
      label: 'First trade',
      description: 'Completed at least one trade',
      icon: '⇄',
      earned: profile.trade_count >= 1,
      color: 'red',
    },
    {
      id: 'trusted',
      label: 'Trusted trader',
      description: '5 or more trades',
      icon: '★',
      earned: profile.trade_count >= 5,
      color: 'gold',
    },
    {
      id: 'power_trader',
      label: 'Power trader',
      description: '20 or more trades',
      icon: '⚡',
      earned: profile.trade_count >= 20,
      color: 'red',
    },
    {
      id: 'verified',
      label: 'Verified',
      description: 'Identity or phone verified',
      icon: '✓',
      earned: profile.verified_id || profile.verified_phone || profile.verified_photo,
      color: 'green',
    },
    {
      id: 'community',
      label: 'Community',
      description: 'Has followers',
      icon: '◉',
      earned: profile.follower_count >= 1,
      color: 'blue',
    },
  ]
}

const COLOR_STYLES = {
  red: { background: 'var(--rbg)', border: '1px solid var(--rbd)', color: 'var(--red)' },
  green: { background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)' },
  gold: { background: 'var(--gldbg)', border: '1px solid var(--gldbd)', color: 'var(--gld)' },
  blue: { background: 'var(--blubg)', border: '1px solid var(--blubd)', color: 'var(--blu)' },
}

const MUTED_STYLE = {
  background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--faint)',
  opacity: 0.5,
}

export function AchievementBadges({ profile }: { profile: Profile }) {
  const achievements = getAchievements(profile)
  const earned = achievements.filter(a => a.earned)

  if (earned.length === 0) return null

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{
        fontFamily: 'var(--font-dm-mono)', fontSize: 9,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: 'var(--faint)', marginBottom: 8,
      }}>
        Achievements
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {earned.map(achievement => (
          <span
            key={achievement.id}
            title={achievement.description}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              padding: '4px 10px', borderRadius: 99,
              ...(achievement.earned ? COLOR_STYLES[achievement.color] : MUTED_STYLE),
            }}
          >
            <span style={{ fontSize: 11 }}>{achievement.icon}</span>
            {achievement.label}
          </span>
        ))}
      </div>
    </div>
  )
}
