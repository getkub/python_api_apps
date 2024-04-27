def isValid(s: str) -> bool:
  """
  Checks if the given string containing parentheses is balanced and valid.

  Args:
      s: The input string containing parentheses.

  Returns:
      True if the string is valid, False otherwise.
  """

  # Define a dictionary to map closing brackets to their opening counterparts
  mapping = {")": "(", "}": "{", "]": "["}

  # Use a stack to keep track of opening brackets encountered
  stack = []

  # Iterate through each character in the string
  for char in s:
    # If the character is an opening bracket, push it onto the stack
    if char in mapping.values():
      stack.append(char)
    # If the character is a closing bracket
    elif char in mapping:
      # Check if the top element of the stack matches the expected opening bracket
      if stack and stack[-1] == mapping[char]:
        stack.pop()  # Pop the matching opening bracket from the stack
      else:
        return False  # Mismatched closing bracket, return False
    # Ignore any other characters

  # After iterating through the string, the stack should be empty for a valid sequence
  return not stack

# Example usage
s1 = "()"
s2 = "()[]{}"
s3 = "(]"
print(isValid(s1))  # Output: True
print(isValid(s2))  # Output: True
print(isValid(s3))  # Output: False
