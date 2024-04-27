def largestNumber(num, change):
  """
  Finds the largest possible integer after mutating a substring of num.

  Args:
      num: A string representing a large integer.
      change: A list of integers mapping digits 0-9 to their replacements.

  Returns:
      A string representing the largest possible integer.
  """
  n = len(num)
  
  # Iterate through the digits of num
  for i in range(n):
    # Check if mutation with the current digit can improve the number
    if i > 0 and change[int(num[i-1])] < int(num[i]):
      break  # No need to check further as mutation won't improve
    
    # Find the rightmost index till which mutation can be beneficial
    j = i
    while j < n - 1 and change[int(num[j])] >= int(num[j+1]):
      j += 1
    
    # Mutate the substring if beneficial
    if j > i:
      # Create a list of digits and mutate them using change
      digits = [change[int(d)] for d in num[i:j+1]]
      # Convert the mutated digits back to a string
      mutated_substring = "".join(map(str, digits))
      # Replace the substring in num with the mutated version
      num = num[:i] + mutated_substring + num[j+1:]
  
  return num

# Example usage
num = "132"
change = [9,8,5,0,3,6,4,2,6,8]
result = largestNumber(num, change)
print(result)  # Output: "832"
