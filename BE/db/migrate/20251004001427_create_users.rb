class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :supabase_user_id
      t.string :email
      t.string :timezone

      t.timestamps
    end
    add_index :users, :supabase_user_id, unique: true
    add_index :users, :email, unique: true
  end
end
