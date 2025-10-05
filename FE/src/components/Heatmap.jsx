import CalendarHeatmap from 'react-calendar-heatmap'

export default function Heatmap({ startDate, endDate, values, classForValue, tooltipForValue, horizontal = true }) {
  return (
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={values}
      horizontal={horizontal}
      classForValue={classForValue}
      tooltipDataAttrs={(value) => ({
        'data-tip': tooltipForValue?.(value) || ''
      })}
    />
  )
}


