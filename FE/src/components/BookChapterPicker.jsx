import { Button } from 'primereact/button'

export default function BookChapterPicker({ books, value, onChange, onBlur, showSave, onSave, saving }) {
  const startBook = value?.startBook || books?.[0]?.name || 'Genesis'
  const max = books?.find(b => b.name === startBook)?.chapter_count || 150
  const startChapter = Math.min(Math.max(parseInt(value?.startChapter || 1, 10), 1), max)

  function handleBookChange(name) {
    const maxForNew = books?.find(b => b.name === name)?.chapter_count || 150
    const clamped = Math.min(startChapter, maxForNew)
    onChange?.({ startBook: name, startChapter: clamped })
  }

  function handleChapterChange(raw) {
    const num = Number(raw) || 1
    const clamped = Math.min(Math.max(num, 1), max)
    onChange?.({ startBook, startChapter: clamped })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="border rounded px-2 py-1"
        value={startBook}
        onChange={(e) => handleBookChange(e.target.value)}
        onBlur={onBlur}
      >
        {(books || []).map(b => (
          <option key={b.id} value={b.name}>{b.name}</option>
        ))}
      </select>
      <input
        type="number"
        className="border rounded px-2 py-1 w-24"
        min={1}
        max={max}
        value={startChapter}
        onChange={(e) => handleChapterChange(e.target.value)}
        onBlur={onBlur}
      />
      {showSave && (
        <Button
          label="Save"
          icon="pi pi-save"
          size="small"
          loading={saving}
          onClick={onSave}
        />
      )}
    </div>
  )
}


