from content import Content  # Import Content class

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
