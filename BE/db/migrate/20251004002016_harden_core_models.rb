class HardenCoreModels < ActiveRecord::Migration[8.0]
  def change
    change_column_null :users, :supabase_user_id, false
    change_column_null :users, :email, false
    change_column_null :users, :timezone, false

    change_column_null :plans, :code, false
    change_column_null :plans, :name, false
    change_column_null :plans, :description, false

    change_column_null :subscriptions, :start_date, false
    change_column_null :subscriptions, :active, false
    change_column_default :subscriptions, :active, from: nil, to: true
    add_index :subscriptions, [:user_id, :plan_id]
    add_index :subscriptions, :active

    change_column_null :completions, :on_date, false
    change_column_null :completions, :reading_ref, false
    change_column_null :completions, :completed_at, false
    add_index :completions, [:user_id, :plan_id, :on_date], unique: true, name: "index_completions_uniqueness"
    add_index :completions, :on_date
  end
end
