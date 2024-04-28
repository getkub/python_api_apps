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
