"""
```python
# Explanation

**Content Class:**

* Defines a class named `Content` to represent a piece of content.
* It has three attributes:
    * `content_id`: Unique identifier for the content (integer)
    * `title`: Title of the content (string)
    * `popularity_score`: Tracks the popularity of the content (integer, initialized to 0)
* Provides two methods:
    * `increase_popularity(value)`: Increases the popularity score by a given value.
    * `decrease_popularity(value)`: Decreases the popularity score by a given value, ensuring it doesn't go below 0.

**PopularityManager Class:**

* Defines a class named `PopularityManager` to manage content and track popularity.
* It has one attribute:
    * `contents`: A dictionary to store `Content` objects using their ID (integer) as the key.
* Provides three methods:
    * `add_content(content)`: Adds a new `Content` object to the manager.
    * `get_most_popular()`: Returns the content object with the highest `popularity_score`.

**Example Usage:**

1. Creates a `PopularityManager` instance.
2. Creates two `Content` objects with titles and IDs.
3. Adds the content objects to the manager.
4. Shows how to increase and decrease popularity for each content.
5. Calls `get_most_popular` to find and print the content with the highest score.

**Additional Notes:**

* This is a basic structure for managing content popularity.
* You can improve it by:
    * Adding different ways to update popularity (likes, views, shares)
    * Storing popularity scores persistently (database)
    * Implementing more complex popularity calculations (decay over time)

"""
class Content:
  """
  This class represents a piece of content.
  """
  def __init__(self, content_id, title):
    self.content_id = content_id
    self.title = title
    self.popularity_score = 0  # Track content popularity

  def increase_popularity(self, value):
    """
    Increases the popularity score of the content by a given value.
    """
    self.popularity_score += value

  def decrease_popularity(self, value):
    """
    Decreases the popularity score of the content by a given value, 
    with a minimum score of 0.
    """
    self.popularity_score = max(self.popularity_score - value, 0)

class PopularityManager:
  """
  This class manages content and provides methods to track popularity.
  """
  def __init__(self):
    self.contents = {}  # Dictionary to store content objects

  def add_content(self, content):
    """
    Adds a new content object to the manager.
    """
    self.contents[content.content_id] = content

  def get_most_popular(self):
    """
    Returns the content object with the highest popularity score.
    """
    most_popular = None
    for content in self.contents.values():
      if most_popular is None or content.popularity_score > most_popular.popularity_score:
        most_popular = content
    return most_popular

# Example usage
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
