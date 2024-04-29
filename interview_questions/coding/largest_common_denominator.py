import math

def gcdOfStrings(str1: str, str2: str) -> str:
  """
  Finds the largest common divisor of two strings.

  Args:
      str1: The first string.
      str2: The second string.

  Returns:
      The largest common divisor string, or an empty string if none exists.
  """
  if str1 + str2 != str2 + str1:  # O(n) time, where n is the length of the strings
    return ""  # O(1) time
  # Find GCD of lengths
  gcd_length = math.gcd(len(str1), len(str2))  # O(log(min(m, n))) time, where m and n are the lengths of the strings
  return str1[:gcd_length]  # O(1) time

# Example usage
str1 = "ABABAB"
str2 = "ABAB"
gcd_string = gcdOfStrings(str1, str2)
print(gcd_string)  # Output: "ABC"
