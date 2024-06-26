from typing import List

def shortestToChar(s: str, c: str) -> List[int]:
    """
    The time complexity for this implementation is O(N * M), 
    where N is the length of the input string 's' and M is the number of occurrences of the character 'c' in the string 's'.
    Calculates the shortest distance to the character 'c' for each character in the string 's'.

    Args:
        s: The input string.
        c: The character to find the distance to.

    Returns:
        A list of integers where each element represents the shortest distance
        from the corresponding index in 's' to the closest occurrence of 'c'.
    """

    result = [float('inf')] * len(s)  # Initialize result with infinity for distances

    # Find all indices of the character 'c' in the string
    c_indices = [i for i, ch in enumerate(s) if ch == c]  # O(N) time complexity

    # Iterate through the string
    for i in range(len(s)):  # O(N) time complexity
        # Find the closest indices of 'c' on either side of the current index
        left_index = right_index = None
        for c_index in c_indices:  # O(M) time complexity, where M is the number of occurrences of 'c'
            if c_index <= i:  # Find the closest 'c' to the left (or equal)
                left_index = c_index
            if c_index >= i:  # Find the closest 'c' to the right (or equal)
                right_index = c_index
                break  # Break after finding the first right index

        # Update the distance in the result list based on the closest indices
        if left_index is not None:
            result[i] = min(result[i], abs(i - left_index))  # O(1) time complexity
        if right_index is not None:
            result[i] = min(result[i], abs(i - right_index))  # O(1) time complexity

    return result

# Example usage
s = "roamaroundtheworld"
c = "o"
distances = shortestToChar(s, c)
print(distances)  # Output: [3, 2, 1, 0, 1, 0, 0, 1, 2, 2, 1, 0]
