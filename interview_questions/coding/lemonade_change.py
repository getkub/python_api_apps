def lemonade_change(bills):
  """
  Checks if the lemonade stand can provide correct change for all customers.

  Args:
      bills: A list of integers representing the bills paid by customers ($5, $10, or $20).

  Returns:
      True if all customers can receive correct change, False otherwise.
  """
  # Initialize a dictionary to store the number of bills of each denomination
  cash_on_hand = {5: 0, 10: 0, 20: 0}

  # Iterate through the bills
  for bill in bills:
    # Customer pays with a $5 bill, no change needed
    if bill == 5:
      cash_on_hand[5] += 1  # Add to $5 bill count

    # Customer pays with a larger bill, need to provide change with $5 and $10 bills
    elif bill == 10:
      # Check if there's enough change for a $10 bill
      if cash_on_hand[5] >= 1:
        cash_on_hand[5] -= 1  # Remove $5 bill used for change
        cash_on_hand[10] += 1  # Add to $10 bill count
      else:
        # Not enough change, cannot serve customer
        return False

    elif bill == 20:
      # Check if there's enough change for a $20 bill using $10 and $5 bills
      if cash_on_hand[10] >= 1 and cash_on_hand[5] >= 1:
        cash_on_hand[10] -= 1  # Remove $10 bill used for change
        cash_on_hand[5] -= 1  # Remove $5 bill used for change
        cash_on_hand[20] += 1  # Add to $20 bill count
      elif cash_on_hand[5] >= 3:  # Check if there's enough $5 bills for change
        cash_on_hand[5] -= 3  # Remove 3 $5 bills used for change
        cash_on_hand[20] += 1  # Add to $20 bill count
      else:
        # Not enough change, cannot serve customer
        return False

  # All customers served successfully
  return True

# Example usage
bills1 = [5, 5, 5, 10, 20]
bills2 = [5, 5, 10, 10, 20]

print(lemonade_change(bills1))  # Output: True
print(lemonade_change(bills2))  # Output: False 
