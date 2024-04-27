PREMIUM_COST = 100  # Replace with actual premium cost
STANDARD_COST = 50  # Replace with actual standard cost

class User:
  def __init__(self, user_type, start_date):
    self.user_type = user_type  # "premium" or "standard"
    self.monthly_cost = PREMIUM_COST if user_type == "premium" else STANDARD_COST
    self.start_date = start_date  # datetime object

def calculate_pro_rated_cost(user, switch_date):
  """
  Calculates a potential pro-rated cost for a user switching to premium within a month 
  (considering standard cost is already paid for the month).

  Args:
      user: A User object representing the user.
      switch_date: A datetime object representing the date of switching.

  Returns:
      A float representing the potential pro-rated cost (might be 0).
  """
  if user.user_type == "premium":
    return 0  # No pro-rated cost if user is already premium

  days_in_month = calendar.monthrange(switch_date.year, switch_date.month)[1]
  print(f"days_in_month: {days_in_month:.0f}")
  days_used = (switch_date - user.start_date).days + 1  # Add 1 for the switch day

  # Potential pro-rated cost based on remaining days as a fraction of month
  pro_rated_cost = (PREMIUM_COST - STANDARD_COST) * (days_in_month - days_used) / days_in_month

  return max(pro_rated_cost, 0)  # Ensure non-negative cost

# Example usage
from datetime import date
import calendar

start_date = date(2024, 4, 1)  # Assuming user starts on April 1st, 2024
switch_date = date(2024, 4, 15)  # User switches on April 15th

user = User("standard", start_date)
pro_rated_cost = calculate_pro_rated_cost(user, switch_date)

print(f"Potential pro-rated cost for switching to premium: ${pro_rated_cost:.2f}")
