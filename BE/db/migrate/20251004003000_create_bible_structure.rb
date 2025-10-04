class CreateBibleStructure < ActiveRecord::Migration[8.0]
  def change
    create_table :books do |t|
      t.string :name, null: false
      t.string :testament, null: false
      t.integer :position, null: false
      t.integer :chapter_count, null: false
      t.timestamps
    end

    add_index :books, :name, unique: true
    add_index :books, :position, unique: true
    add_index :books, :testament

    create_table :chapters do |t|
      t.references :book, null: false, foreign_key: true
      t.integer :number, null: false
      t.timestamps
    end

    add_index :chapters, [:book_id, :number], unique: true
  end
end


