export type ServiceCategory =
  | 'Design'
  | 'Development'
  | 'Writing'
  | 'Marketing'
  | 'Video'
  | 'Music'
  | 'Photography'
  | 'Consulting'
  | 'Legal'
  | 'Finance'
  | 'Education'
  | 'Other'

export type BriefStatus = 'open' | 'matched' | 'in_progress' | 'completed' | 'disputed'

export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'disputed'

export type ApplicationStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn'

/** A skill/service listing — what someone offers */
export interface ServiceListing {
  id: string
  user_id: string
  title: string
  description: string
  category: ServiceCategory
  skills: string[]               // tags e.g. ["React", "TypeScript"]
  delivery_time_days: number | null
  credit_rate: number            // Credits per unit of work
  credit_unit: string            // e.g. "per hour", "per project", "per 1000 words"
  portfolio_urls: string[]       // required
  is_available: boolean
  created_at: string
  updated_at: string
  profile?: import('./index').Profile
}

/** A brief — what someone needs */
export interface Brief {
  id: string
  user_id: string
  title: string
  description: string
  category: ServiceCategory
  skills_needed: string[]
  budget_credits: number | null   // max Credits willing to spend
  deadline: string | null
  status: BriefStatus
  selected_application_id: string | null
  created_at: string
  profile?: import('./index').Profile
  milestones?: Milestone[]
  application_count?: number
}

/** A milestone within a matched brief */
export interface Milestone {
  id: string
  brief_id: string
  title: string
  description: string | null
  credits: number                // Credits released on approval
  status: MilestoneStatus
  due_date: string | null
  submitted_at: string | null
  approved_at: string | null
  created_at: string
}

/** Freelancer applying to a brief */
export interface Application {
  id: string
  brief_id: string
  applicant_id: string
  cover_note: string
  proposed_credits: number
  proposed_timeline_days: number | null
  status: ApplicationStatus
  created_at: string
  profile?: import('./index').Profile
}

/** Credit transaction record */
export interface CreditTransaction {
  id: string
  user_id: string
  amount: number               // positive = earned, negative = spent
  type: 'earned' | 'spent' | 'granted' | 'expired'
  reference_id: string | null  // milestone_id, brief_id, etc.
  note: string | null
  created_at: string
}

/** User's credit balance + history */
export interface CreditBalance {
  user_id: string
  balance: number
  lifetime_earned: number
  lifetime_spent: number
}
