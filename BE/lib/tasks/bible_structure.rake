namespace :bible do
  desc "Seed canonical books and chapters without verse text"
  task seed_structure: :environment do
    canonical = [
      # [position, testament, name, chapter_count]
      [1, "Old Testament", "Genesis", 50],
      [2, "Old Testament", "Exodus", 40],
      [3, "Old Testament", "Leviticus", 27],
      [4, "Old Testament", "Numbers", 36],
      [5, "Old Testament", "Deuteronomy", 34],
      [6, "Old Testament", "Joshua", 24],
      [7, "Old Testament", "Judges", 21],
      [8, "Old Testament", "Ruth", 4],
      [9, "Old Testament", "1 Samuel", 31],
      [10, "Old Testament", "2 Samuel", 24],
      [11, "Old Testament", "1 Kings", 22],
      [12, "Old Testament", "2 Kings", 25],
      [13, "Old Testament", "1 Chronicles", 29],
      [14, "Old Testament", "2 Chronicles", 36],
      [15, "Old Testament", "Ezra", 10],
      [16, "Old Testament", "Nehemiah", 13],
      [17, "Old Testament", "Esther", 10],
      [18, "Old Testament", "Job", 42],
      [19, "Old Testament", "Psalms", 150],
      [20, "Old Testament", "Proverbs", 31],
      [21, "Old Testament", "Ecclesiastes", 12],
      [22, "Old Testament", "Song of Solomon", 8],
      [23, "Old Testament", "Isaiah", 66],
      [24, "Old Testament", "Jeremiah", 52],
      [25, "Old Testament", "Lamentations", 5],
      [26, "Old Testament", "Ezekiel", 48],
      [27, "Old Testament", "Daniel", 12],
      [28, "Old Testament", "Hosea", 14],
      [29, "Old Testament", "Joel", 3],
      [30, "Old Testament", "Amos", 9],
      [31, "Old Testament", "Obadiah", 1],
      [32, "Old Testament", "Jonah", 4],
      [33, "Old Testament", "Micah", 7],
      [34, "Old Testament", "Nahum", 3],
      [35, "Old Testament", "Habakkuk", 3],
      [36, "Old Testament", "Zephaniah", 3],
      [37, "Old Testament", "Haggai", 2],
      [38, "Old Testament", "Zechariah", 14],
      [39, "Old Testament", "Malachi", 4],
      [40, "New Testament", "Matthew", 28],
      [41, "New Testament", "Mark", 16],
      [42, "New Testament", "Luke", 24],
      [43, "New Testament", "John", 21],
      [44, "New Testament", "Acts", 28],
      [45, "New Testament", "Romans", 16],
      [46, "New Testament", "1 Corinthians", 16],
      [47, "New Testament", "2 Corinthians", 13],
      [48, "New Testament", "Galatians", 6],
      [49, "New Testament", "Ephesians", 6],
      [50, "New Testament", "Philippians", 4],
      [51, "New Testament", "Colossians", 4],
      [52, "New Testament", "1 Thessalonians", 5],
      [53, "New Testament", "2 Thessalonians", 3],
      [54, "New Testament", "1 Timothy", 6],
      [55, "New Testament", "2 Timothy", 4],
      [56, "New Testament", "Titus", 3],
      [57, "New Testament", "Philemon", 1],
      [58, "New Testament", "Hebrews", 13],
      [59, "New Testament", "James", 5],
      [60, "New Testament", "1 Peter", 5],
      [61, "New Testament", "2 Peter", 3],
      [62, "New Testament", "1 John", 5],
      [63, "New Testament", "2 John", 1],
      [64, "New Testament", "3 John", 1],
      [65, "New Testament", "Jude", 1],
      [66, "New Testament", "Revelation", 22]
    ]

    Book.transaction do
      canonical.each do |position, testament, name, chapter_count|
        book = Book.find_or_initialize_by(name: name)
        book.testament = testament
        book.position = position
        book.chapter_count = chapter_count
        book.save! if book.changed?

        # Ensure chapters 1..chapter_count exist
        existing_numbers = book.chapters.pluck(:number)
        missing = (1..chapter_count).to_a - existing_numbers
        missing.each do |num|
          book.chapters.create!(number: num)
        end

        # Remove extra chapters if schema changed downward
        extras = existing_numbers - (1..chapter_count).to_a
        if extras.any?
          book.chapters.where(number: extras).delete_all
        end
      end
    end

    puts "Seeded books and chapters (structure only)."
  end
end


