import { Card } from 'primereact/card'
import { Button } from 'primereact/button'

export default function PlanCard({ plan, description, actions, subscribed, onToggle, loading }) {
  return (
    <Card title={plan.name} subTitle={(plan.code || '').replaceAll('_', ' ')}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm opacity-80 flex-1 flex-basis-28rem">{description}</p>
        <div className="flex flex-col items-end gap-2">
          {actions}
          <Button
            label={subscribed ? 'Unsubscribe' : 'Subscribe'}
            icon={subscribed ? 'pi pi-minus' : 'pi pi-plus'}
            outlined={!subscribed}
            severity={subscribed ? 'danger' : 'primary'}
            loading={loading}
            onClick={onToggle}
          />
        </div>
      </div>
    </Card>
  )
}


