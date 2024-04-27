from collections import Counter

class Solution:
  def rankTeams(self, votes):
    # Initialize nodes with character and empty count list
    nodes = {chr(i + ord('A')): Counter() for i in range(26)}

    # Count occurrences of each team based on their position in the vote
    for vote in votes:
      for i, char in enumerate(vote):
        nodes[char][i] += 1

    # Sort nodes based on decreasing count and lexicographically
    nodes = sorted(nodes.items(), key=lambda x: (-max(x[1].values()), x[0]))
    
    # Build the ranked string
    # return ''.join([team for team, _ in nodes])
    return nodes

# Example usage
votes = ["ABC", "ACB", "BCA", "CAB", "CBA"]
solution = Solution()
result = solution.rankTeams(votes)
print(result)
