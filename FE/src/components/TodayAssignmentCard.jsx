import { Button } from 'primereact/button'

export default function TodayAssignmentCard({ assignment, onComplete, saving }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{assignment.plan_name}</h3>
        <p className="text-gray-600">{assignment.reading_ref}</p>
        {assignment.completed && (
          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
            <i className="pi pi-check-circle"></i>
            Completed
          </span>
        )}
      </div>
      <Button
        label={assignment.completed ? "Completed" : "Mark as Read"}
        icon={assignment.completed ? "pi pi-check" : "pi pi-book"}
        severity={assignment.completed ? "success" : "primary"}
        disabled={assignment.completed}
        loading={!!saving}
        onClick={onComplete}
      />
    </div>
  )
}


