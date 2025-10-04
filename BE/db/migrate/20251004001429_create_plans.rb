class CreatePlans < ActiveRecord::Migration[8.0]
  def change
    create_table :plans do |t|
      t.string :code
      t.string :name
      t.text :description

      t.timestamps
    end
    add_index :plans, :code, unique: true
  end
end
