import { Search, Dumbbell } from 'lucide-react'

const exercises = [
  { id: '1', name: 'Barbell Back Squat', workout: 'Power Legs', muscle: 'Quadriceps', sets: 4, reps: '8–10', order: 1 },
  { id: '2', name: 'Romanian Deadlift', workout: 'Power Legs', muscle: 'Hamstrings', sets: 3, reps: '10–12', order: 2 },
  { id: '3', name: 'Push-Up', workout: 'Beginner Upper Body', muscle: 'Chest', sets: 3, reps: '15', order: 1 },
  { id: '4', name: 'Dumbbell Row', workout: 'Beginner Upper Body', muscle: 'Back', sets: 3, reps: '12', order: 2 },
  { id: '5', name: 'Plank Hold', workout: 'Core Blast', muscle: 'Core', sets: 3, reps: '60s', order: 1 },
  { id: '6', name: 'Bicycle Crunch', workout: 'Core Blast', muscle: 'Core', sets: 3, reps: '20', order: 2 },
]

export default function ExercisesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Exercises</h1>
        <p className="text-sm text-slate-500 mt-0.5">All exercises across all workouts</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search exercises..." />
          </div>
          <select className="input h-9 w-auto text-sm py-0 ml-auto">
            <option>All Workouts</option>
            <option>Power Legs</option>
            <option>Core Blast</option>
            <option>Beginner Upper Body</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Exercise</th>
                <th className="table-th">Workout</th>
                <th className="table-th">Muscle Group</th>
                <th className="table-th">Sets</th>
                <th className="table-th">Reps</th>
                <th className="table-th">Order</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((e) => (
                <tr key={e.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                        <Dumbbell size={14} className="text-brand" />
                      </div>
                      <span className="font-medium text-slate-800">{e.name}</span>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="badge badge-neutral">{e.workout}</span>
                  </td>
                  <td className="table-td text-slate-500">{e.muscle}</td>
                  <td className="table-td">{e.sets}</td>
                  <td className="table-td">{e.reps}</td>
                  <td className="table-td">#{e.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
