class CreateSubscriptions < ActiveRecord::Migration[8.0]
  def change
    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :plan, null: false, foreign_key: true
      t.date :start_date
      t.json :settings
      t.boolean :active
      t.string :timezone_override

      t.timestamps
    end
  end
end
