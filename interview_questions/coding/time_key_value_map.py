class TimeMap:

    def __init__(self):
        """
        Initializes the TimeMap object.

        This data structure uses a dictionary `self.data` to store key-value pairs
        along with their timestamps. Each key maps to a list of tuples containing
        (timestamp, value) pairs.
        """
        self.data = {}  # Dictionary to store key-value pairs with timestamps

    def set(self, key: str, value: str, timestamp: int) -> None:
        """
        Stores the key-value pair with the given timestamp.

        If the key doesn't exist in `self.data`, a new list is created to store
        the (timestamp, value) pairs for that key. We then append the new pair
        to the key's list.
        """
        if key not in self.data:
            self.data[key] = []
        self.data[key].append((timestamp, value))  # Append (timestamp, value) pair

    def get(self, key: str, timestamp: int) -> str:
        """
        Returns the value associated with the largest timestamp less than or equal to the given timestamp.

        If the key doesn't exist in `self.data`, it means no key-value pairs have
        been set for that key, so we return an empty string.

        Otherwise, we retrieve the list of (timestamp, value) pairs associated with
        the key. We use binary search to efficiently find the index of the first
        timestamp in the list that is less than or equal to the given timestamp.

        - If an exact match is found (`values[mid][0] == timestamp`), the corresponding
          value (`values[mid][1]`) is returned.
        - If no exact match is found, the binary search narrows down the potential
          indices (left and right) based on the comparison with the middle element's
          timestamp.
        - If the loop finishes without finding a smaller timestamp (right index at -1),
          it means all timestamps are greater and we return the value from the last element.
        """
        if key not in self.data:
            return ""  # No key found

        values = self.data[key]
        left, right = 0, len(values) - 1
        while left <= right:
            mid = (left + right) // 2
            if values[mid][0] == timestamp:
                return values[mid][1]  # Exact match
            elif values[mid][0] < timestamp:
                left = mid + 1
            else:
                right = mid - 1

        # Return the value at the last element if no exact or smaller timestamp found
        return values[-1][1] if right >= 0 else ""  # Right index at -1 means no smaller timestamp

# Example usage
timeMap = TimeMap()
timeMap.set("foo", "bar", 1)
print(timeMap.get("foo", 1))  # Output: bar
print(timeMap.get("foo", 3))  # Output: bar
timeMap.set("foo", "bar2", 4)
print(timeMap.get("foo", 4))  # Output: bar2
print(timeMap.get("foo", 5))  # Output: bar2
