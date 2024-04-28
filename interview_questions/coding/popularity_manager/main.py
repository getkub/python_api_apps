from popularity_manager import PopularityManager
from content import Content

content_manager = PopularityManager()

content1 = Content(1, "Article 1")
content2 = Content(2, "Video Tutorial")

content_manager.add_content(content1)
content_manager.add_content(content2)

# Increase popularity of content1 by 5 points
content1.increase_popularity(5)

# Decrease popularity of content2 by 2 points (minimum 0)
content2.decrease_popularity(2)

# Get the most popular content
most_popular_content = content_manager.get_most_popular()
print(f"Most popular content: {most_popular_content.title} (ID: {most_popular_content.content_id})")
