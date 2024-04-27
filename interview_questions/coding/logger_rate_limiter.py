from collections import deque
from datetime import datetime

class Logger:
    """
    This class implements a logging rate limiter that restricts the number of times
    the same message can be printed within a specified time window.
    """
    def __init__(self):
        """
        Initializes the logger with a dictionary to store message timestamps.

        - lastTime: A dictionary to track the last timestamp each message was printed.
        """
        self.lastTime = dict()

    def shouldPrintMessage(self, timestamp: str, message: str) -> bool:
        """
        Checks if the message should be printed based on the rate limit.

        - timestamp: The timestamp string in a specific format (YYYY-MM-DDT%H:%M:%S %z).
        - message: The message content to be printed.

        Returns:
            True if the message can be printed, False otherwise.
        """
        # Parse the timestamp string into epoch timestamp (milliseconds) for calculations
        timestamp_epoch = int(datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S %z").timestamp() * 1000)

        # Check if the message exists in the lastTime dictionary
        if message in self.lastTime:
            # Check if the time difference between current and last timestamp is less than the limit (5 seconds)
            if timestamp_epoch - self.lastTime[message] < 5000:
                return False  # Block message if within the time limit

        # Update the lastTime dictionary with the current timestamp for the message
        self.lastTime[message] = timestamp_epoch
        return True  # Allow message printing

    def print_message(self, timestamp: str, message: str):
        """
        Prints the message and timestamp if allowed by the rate limiter.

        - timestamp: The timestamp string in a specific format (YYYY-MM-DDT%H:%M:%S %z).
        - message: The message content to be printed.
        """
        if self.shouldPrintMessage(timestamp, message):
            print(f"{timestamp} {message}")

# Example usage
logger = Logger()

# Messages with same message content but different timestamps will be allowed within 10 seconds
print(logger.print_message("2024-01-02T04:00:00 -0000", '"GET /cgi-bin/try/ HTTP/1.0" 200 3395'))  # True
print(logger.print_message("2024-01-02T04:02:00 -0000", '"GET /cgi-bin/try/ HTTP/1.0" 200 3395'))  # True
print(logger.print_message("2024-01-02T04:02:01 -0000", '"GET /cgi-bin/try/ HTTP/1.0" 200 3395'))  # False
print(logger.print_message("2024-01-02T04:02:03 -0000", '"GET /cgi-bin/try/ HTTP/1.0" 200 3395'))  # False
print(logger.print_message("2024-01-02T04:02:04 -0000", '"GET /cgi-bin/try/ HTTP/1.0" 200 3395'))  # False
print(logger.print_message("2024-01-02T04:02:04 -0000", '"GET /cgi-bin/try/ HTTP/1.0" 200 3395'))  # False
print(logger.print_message("2024-01-02T04:02:05 -0000", '"GET /cgi-bin/try/ HTTP/1.0" 200 3395'))  # True

