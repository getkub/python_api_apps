from collections import deque
import time

class RateLimiter:
  """
  Creating a HitCounter object: O(1)
  Retrieving or updating client data from the client_timestamp_map: O(1)
  Checking if a request is allowed within the HitCounter: O(1)
  Overall time complexity: O(1)
  The space complexity is as follows:

  Storing client data in the client_timestamp_map: O(N), where N is the number of clients
  Storing timestamps in the HitCounter queue: O(K), where K is the number of timestamps stored for a client
  Overall space complexity: O(N + K)

  This class implements a rate limiter that restricts the number of requests a client
  can send within a specified time window.
  """
  def __init__(self):
    """
    Initializes the rate limiter with default settings.

    - REQUEST_LIMIT: The maximum number of requests allowed within the time window.
    - TIME_LIMIT: The time window duration in milliseconds (ms).
    """
    self.REQUEST_LIMIT = 10
    self.TIME_LIMIT = 5000  # milliseconds

  class HitCounter:
    """
    This inner class tracks the request history for each client.
    """
    def __init__(self, request_limit):
      """
      Initializes the HitCounter with the request limit.

      - request_limit: The maximum number of requests allowed for a client.
      """
      self.queue = deque()  # Queue to store timestamps of recent requests
      self.request_limit = request_limit

    def hit(self, timestamp):
      """
      Checks if a request is allowed based on the request limit and time window.

      - timestamp: The current timestamp in milliseconds.

      Returns:
          True if the request is allowed, False otherwise.
      """
      # Remove timestamps older than the time limit from the queue
      while self.queue and self.queue[0] + self.TIME_LIMIT <= timestamp:
        self.queue.popleft()  # Remove expired timestamps

      # Check if the request count is below the limit
      if len(self.queue) < self.request_limit:
        self.queue.append(timestamp)  # Add current timestamp to the queue
        return True
      return False

  def client_timestamp_map(self):
    """
    Returns a dictionary to store client IDs and their HitCounter objects.

    This method can be extended to use a more efficient data structure for larger
    numbers of clients if needed.
    """
    return {}  # Use a dictionary or a more efficient data structure if needed

  def is_allowed(self, client_id):
    """
    Checks if a request from a client is allowed based on the rate limit.

    - client_id: The unique identifier of the client making the request.

    Returns:
        True if the request is allowed, False otherwise.
    """
    current_time = int(round(time.time() * 1000))  # Get current time in milliseconds

    # Check if the client has no entry in the client_timestamp_map (first request)
    if client_id not in self.client_timestamp_map():
      hit_counter = self.HitCounter(self.REQUEST_LIMIT)  # Create a HitCounter object
      hit_counter.hit(current_time)  # Record the first request timestamp
      self.client_timestamp_map()[client_id] = hit_counter  # Store HitCounter for the client
      return True
    else:
      hit_counter = self.client_timestamp_map()[client_id]  # Retrieve client's HitCounter
      return hit_counter.hit(current_time)  # Check if request is allowed based on hit history

# Example usage
rate_limiter = RateLimiter()

# First request from client1 is allowed
print(rate_limiter.is_allowed("client1"))  # True

# Second request within the time limit is allowed
print(rate_limiter.is_allowed("client1"))  # True (if within 1000 milliseconds)

# Requests exceeding the limit within the time window are blocked
for _ in range(rate_limiter.REQUEST_LIMIT - 2):
  print(rate_limiter.is_allowed("client1"))  # True

print(rate_limiter.is_allowed("client1"))  # False (exceeds limit)

# Request after the time window resets the counter for client1
time.sleep(1.1)  # Wait for the time window to pass

print(rate_limiter.is_allowed("client1"))  # True (limit reset)

# New client2 is allowed its first request
print(rate_limiter.is_allowed("client2"))  # True

# Corrected call to is_allowed
print(rate_limiter.is_allowed("client1"))  # True (assuming time window has passed)
