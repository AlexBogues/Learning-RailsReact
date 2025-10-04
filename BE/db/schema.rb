# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_10_04_003000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "books", force: :cascade do |t|
    t.string "name", null: false
    t.string "testament", null: false
    t.integer "position", null: false
    t.integer "chapter_count", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_books_on_name", unique: true
    t.index ["position"], name: "index_books_on_position", unique: true
    t.index ["testament"], name: "index_books_on_testament"
  end

  create_table "chapters", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.integer "number", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_id", "number"], name: "index_chapters_on_book_id_and_number", unique: true
    t.index ["book_id"], name: "index_chapters_on_book_id"
  end

  create_table "completions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "plan_id", null: false
    t.date "on_date", null: false
    t.string "reading_ref", null: false
    t.datetime "completed_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["on_date"], name: "index_completions_on_on_date"
    t.index ["plan_id"], name: "index_completions_on_plan_id"
    t.index ["user_id", "plan_id", "on_date"], name: "index_completions_uniqueness", unique: true
    t.index ["user_id"], name: "index_completions_on_user_id"
  end

  create_table "plans", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.text "description", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_plans_on_code", unique: true
  end

  create_table "subscriptions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "plan_id", null: false
    t.date "start_date", null: false
    t.json "settings"
    t.boolean "active", default: true, null: false
    t.string "timezone_override"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_subscriptions_on_active"
    t.index ["plan_id"], name: "index_subscriptions_on_plan_id"
    t.index ["user_id", "plan_id"], name: "index_subscriptions_on_user_id_and_plan_id"
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "supabase_user_id", null: false
    t.string "email", null: false
    t.string "timezone", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["supabase_user_id"], name: "index_users_on_supabase_user_id", unique: true
  end

  add_foreign_key "chapters", "books"
  add_foreign_key "completions", "plans"
  add_foreign_key "completions", "users"
  add_foreign_key "subscriptions", "plans"
  add_foreign_key "subscriptions", "users"
end
