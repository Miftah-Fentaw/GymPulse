export interface Discipline {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  isActive: boolean
  enrolledMembers: number
  activeWorkouts: number
  trainingPrograms: number
  publishedArticles: number
  activeClasses: number
}

export interface SportWorkout {
  id: string
  title: string
  description: string
  durationMins: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  disciplineId: string
  category: string
  isPublished: boolean
  exercisesCount: number
  createdAt: string
}

export interface SportProgram {
  id: string
  title: string
  description: string
  durationWeeks: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  disciplineId: string
  category: string
  isPublished: boolean
  workoutsCount: number
  createdAt: string
}

export interface SportArticle {
  id: string
  title: string
  description: string
  contentType: 'article' | 'workout' | 'program' | 'tip' | 'announcement'
  disciplineId: string
  category: string
  isPublished: boolean
  publishedAt: string
  author: string
}

export const MOCK_DISCIPLINE_CATEGORIES: Record<string, string[]> = {
  boxing: ['Footwork & Stance', 'Heavy Bag Drills', 'Sparring & Defense', 'Speed Bag & Cardio', 'Knockout Power'],
  aerobics: ['High Impact Cardio', 'Step Aerobics', 'Dance Fitness', 'Low Impact Conditioning', 'Core & Rhythm'],
  gym: ['Hypertrophy / Muscle Mass', 'Strength & Powerlifting', 'Bodyweight & Calisthenics', 'Functional Fitness', 'Mobility & Recovery'],
  crossfit: ['WOD Conditioning', 'Olympic Weightlifting', 'Gymnastics & Skill', 'Endurance & Engine', 'Hero Workouts'],
  mma: ['Grappling & Takedowns', 'Striking Combinations', 'Ground & Pound', 'Submission Defense', 'Cage Work'],
  yoga: ['Vinyasa Flow', 'Yin Yoga & Flexibility', 'Power Yoga', 'Breathwork & Meditation', 'Ashtanga Essentials'],
}

export const MOCK_DISCIPLINES: Discipline[] = [
  {
    id: 'disc-boxing',
    name: 'Boxing',
    slug: 'boxing',
    description: 'Sweet science of punching technique, footwork, speed bag drills, and high-intensity conditioning.',
    color: '#EF4444',
    icon: '🥊',
    isActive: true,
    enrolledMembers: 3420,
    activeWorkouts: 45,
    trainingPrograms: 6,
    publishedArticles: 18,
    activeClasses: 24,
  },
  {
    id: 'disc-aerobics',
    name: 'Aerobics & Cardio',
    slug: 'aerobics',
    description: 'Dynamic group cardio workouts, dance rhythms, step conditioning, and fat-burning endurance sessions.',
    color: '#F59E0B',
    icon: '🏃',
    isActive: true,
    enrolledMembers: 2890,
    activeWorkouts: 38,
    trainingPrograms: 4,
    publishedArticles: 12,
    activeClasses: 30,
  },
  {
    id: 'disc-gym',
    name: 'Gym & Bodybuilding',
    slug: 'gym',
    description: 'Comprehensive strength training, hypertrophy split routines, powerlifting, and machine workouts.',
    color: '#3B82F6',
    icon: '🏋️',
    isActive: true,
    enrolledMembers: 5120,
    activeWorkouts: 64,
    trainingPrograms: 10,
    publishedArticles: 28,
    activeClasses: 42,
  },
  {
    id: 'disc-crossfit',
    name: 'CrossFit & WOD',
    slug: 'crossfit',
    description: 'Constantly varied functional movements performed at high intensity for total athletic conditioning.',
    color: '#10B981',
    icon: '⚡',
    isActive: true,
    enrolledMembers: 1950,
    activeWorkouts: 52,
    trainingPrograms: 8,
    publishedArticles: 15,
    activeClasses: 18,
  },
  {
    id: 'disc-mma',
    name: 'MMA & Grappling',
    slug: 'mma',
    description: 'Mixed Martial Arts integrating wrestling, Brazilian Jiu-Jitsu, striking, and cage control.',
    color: '#8B5CF6',
    icon: '🥋',
    isActive: true,
    enrolledMembers: 1480,
    activeWorkouts: 30,
    trainingPrograms: 5,
    publishedArticles: 10,
    activeClasses: 14,
  },
  {
    id: 'disc-yoga',
    name: 'Yoga & Flexibility',
    slug: 'yoga',
    description: 'Mindful movement, Vinyasa flows, deep stretching, posture alignment, and stress recovery.',
    color: '#EC4899',
    icon: '🧘',
    isActive: true,
    enrolledMembers: 2210,
    activeWorkouts: 32,
    trainingPrograms: 4,
    publishedArticles: 14,
    activeClasses: 22,
  },
]

export const MOCK_SPORT_WORKOUTS: Record<string, SportWorkout[]> = {
  'disc-boxing': [
    { id: 'w-b1', title: 'Heavy Bag Power Combinations', description: '6-round heavy bag workout focusing on jab-cross-hook combos and slip defense.', durationMins: 45, difficulty: 'intermediate', disciplineId: 'disc-boxing', category: 'Heavy Bag Drills', isPublished: true, exercisesCount: 8, createdAt: '2026-08-10' },
    { id: 'w-b2', title: 'Speed Bag Rhythm & Shoulder Endurance', description: '30-minute high-cadence speed bag and jump rope conditioning burn.', durationMins: 30, difficulty: 'beginner', disciplineId: 'disc-boxing', category: 'Speed Bag & Cardio', isPublished: true, exercisesCount: 5, createdAt: '2026-08-12' },
    { id: 'w-b3', title: 'Championship Sparring Conditioning', description: '12-round simulated fight intensity with medicine ball slams and burpees.', durationMins: 60, difficulty: 'advanced', disciplineId: 'disc-boxing', category: 'Sparring & Defense', isPublished: true, exercisesCount: 12, createdAt: '2026-08-15' },
  ],
  'disc-gym': [
    { id: 'w-g1', title: 'Push Day: Chest, Shoulders & Triceps', description: 'Barbell bench press, incline dumbbell press, overhead press, and cable flyes.', durationMins: 60, difficulty: 'intermediate', disciplineId: 'disc-gym', category: 'Hypertrophy / Muscle Mass', isPublished: true, exercisesCount: 7, createdAt: '2026-08-08' },
    { id: 'w-g2', title: 'Deadlift & Back Strength Builder', description: 'Conventional deadlifts, lat pulldowns, barbell rows, and face pulls.', durationMins: 65, difficulty: 'advanced', disciplineId: 'disc-gym', category: 'Strength & Powerlifting', isPublished: true, exercisesCount: 6, createdAt: '2026-08-11' },
  ],
  'disc-aerobics': [
    { id: 'w-a1', title: 'High-Step Rhythm Burn', description: 'Energetic step aerobics routine with upbeat tempo transitions.', durationMins: 45, difficulty: 'beginner', disciplineId: 'disc-aerobics', category: 'Step Aerobics', isPublished: true, exercisesCount: 6, createdAt: '2026-08-05' },
  ],
}

export const MOCK_SPORT_PROGRAMS: Record<string, SportProgram[]> = {
  'disc-boxing': [
    { id: 'p-b1', title: '8-Week Golden Gloves Conditioning', description: 'Transform into ring shape with technical footwork, bag work, and core stamina.', durationWeeks: 8, difficulty: 'intermediate', disciplineId: 'disc-boxing', category: 'Knockout Power', isPublished: true, workoutsCount: 24, createdAt: '2026-07-20' },
    { id: 'p-b2', title: '4-Week Boxing Footwork Mastery', description: 'Master pivot angles, ducking under hooks, and offensive lateral shifts.', durationWeeks: 4, difficulty: 'beginner', disciplineId: 'disc-boxing', category: 'Footwork & Stance', isPublished: true, workoutsCount: 12, createdAt: '2026-08-01' },
  ],
  'disc-gym': [
    { id: 'p-g1', title: '12-Week Mass Monster Split', description: 'Classic 4-day hypertrophy split designed to maximize lean muscle gains.', durationWeeks: 12, difficulty: 'advanced', disciplineId: 'disc-gym', category: 'Hypertrophy / Muscle Mass', isPublished: true, workoutsCount: 48, createdAt: '2026-06-15' },
  ],
}

export const MOCK_SPORT_ARTICLES: Record<string, SportArticle[]> = {
  'disc-boxing': [
    { id: 'art-b1', title: '5 Essential Defense Slips Every Boxer Must Master', description: 'How to duck, roll, and counter off your opponent lead jab.', contentType: 'article', disciplineId: 'disc-boxing', category: 'Sparring & Defense', isPublished: true, publishedAt: '2026-08-14', author: 'Coach Marcus (Boxing Head)' },
    { id: 'art-b2', title: 'Hand Wrapping Guide for Bag Safety', description: 'Step-by-step wrist and knuckle wrapping technique for heavy impact.', contentType: 'tip', disciplineId: 'disc-boxing', category: 'Footwork & Stance', isPublished: true, publishedAt: '2026-08-10', author: 'Coach Marcus (Boxing Head)' },
  ],
  'disc-gym': [
    { id: 'art-g1', title: 'Optimizing Protein Intake Around Training Windows', description: 'Science-backed breakdown of leucine thresholds and post-workout nutrition.', contentType: 'article', disciplineId: 'disc-gym', category: 'Hypertrophy / Muscle Mass', isPublished: true, publishedAt: '2026-08-09', author: 'Dr. Sarah Lin' },
  ],
}
