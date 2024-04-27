from collections import deque


class HitCounter:
  """
  This class implements a hit counter that tracks the number of requests within a time window.
  """
  def __init__(self):
    """
    Initializes the hit counter with an empty queue and a time limit.

    - TIME_LIMIT: The time window duration in seconds (default: 300 seconds or 5 minutes).
    - queue: A deque to store timestamps and counts of hits at each timestamp.
    """
    self.TIME_LIMIT = 300  # Time window (5 minutes in seconds)
    self.queue = deque()

  def hit(self, timestamp):
    """
    Records a hit at the given timestamp.

    - timestamp: The timestamp (in seconds) of the request.
    """
    # If the queue is empty or the current timestamp is different from the last timestamp
    if not self.queue or self.queue[-1][0] != timestamp:
      self.queue.append([timestamp, 1])  # Add new timestamp with count 1
    else:
      # Increment the count for the existing timestamp (same second)
      self.queue[-1][1] += 1

    # Remove timestamps older than the time window from the beginning of the queue
    while self.queue and self.queue[0][0] + self.TIME_LIMIT <= timestamp:
      self.queue.popleft()

  def getHits(self, timestamp):
    """
    Returns the number of hits within the past time window from the given timestamp.

    - timestamp: The timestamp (in seconds) for which to get the hit count.

    Returns:
        The number of hits within the past time window.
    """
    # Calculate the total count of hits within the window by summing counts from timestamps
    total_hits = sum(count for timestamp, count in self.queue if timestamp + self.TIME_LIMIT > timestamp)
    return total_hits

# Example usage
hitCounter = HitCounter()
hitCounter.hit(1)       # hit at timestamp 1
hitCounter.hit(2)       # hit at timestamp 2
hitCounter.hit(3)       # hit at timestamp 3
print(hitCounter.getHits(4))   # get hits at timestamp 4, return 3
hitCounter.hit(300)     # hit at timestamp 300
print(hitCounter.getHits(300)) # get hits at timestamp 300, return 4 (includes itself)
hitCounter.hit(309)     # hit at timestamp 309
print(hitCounter.getHits(320)) # get hits at timestamp 320, return 2
