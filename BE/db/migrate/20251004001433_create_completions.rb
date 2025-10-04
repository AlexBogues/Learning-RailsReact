class CreateCompletions < ActiveRecord::Migration[8.0]
  def change
    create_table :completions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :plan, null: false, foreign_key: true
      t.date :on_date
      t.string :reading_ref
      t.datetime :completed_at

      t.timestamps
    end
  end
end
