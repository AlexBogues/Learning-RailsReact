# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Seed the canonical Bible structure (books and chapters) without verse text
Rake::Task["bible:seed_structure"].invoke

# Seed initial reading plans (idempotent)
[
  {
    code: "proverb_of_day",
    name: "Proverb of the Day",
    description: "Read the chapter of Proverbs corresponding to today's date."
  },
  {
    code: "daily_chapter",
    name: "Daily Chapter",
    description: "Read one chapter per day through the Bible, starting from your chosen book and chapter."
  }
].each do |attrs|
  plan = Plan.find_or_initialize_by(code: attrs[:code])
  plan.name = attrs[:name]
  plan.description = attrs[:description]
  plan.save!
end
