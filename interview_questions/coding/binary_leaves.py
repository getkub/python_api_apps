from collections import deque

class TreeNode:
  def __init__(self, val):
    self.val = val
    self.left = None
    self.right = None

def printLeavesByLevel(root):
  """
  Prints leaf nodes of an unbalanced binary tree by level and removes them.

  Args:
      root: The root node of the binary tree.
  """
  if not root:
    return

  result = []  # O(n) space, where n is the number of nodes in the tree
  queue = deque([root])  # O(n) space, where n is the number of nodes in the tree
  visited = set()  # O(n) space, where n is the number of nodes in the tree

  while queue:
    level_nodes = []  # O(h) space, where h is the height of the tree
    for _ in range(len(queue)):  # O(n) time, where n is the number of nodes in the current level
      node = queue.popleft()  # O(1) time
      visited.add(node)  # O(1) time

      if not node.left and not node.right:
        level_nodes.append(node.val)  # O(1) time
        # Remove node (implementation depends on your tree structure)
        # (e.g., set node.left and node.right to None)

      if node.left and node.left not in visited:
        queue.append(node.left)  # O(1) time
      if node.right and node.right not in visited:
        queue.append(node.right)  # O(1) time

    result.append(level_nodes)  # O(1) time

  # Print results by level
  for level in result:  # O(h) time, where h is the height of the tree
    print(level)  # O(h) time

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
# root.right.left = TreeNode(6)
# root.left.left.right = TreeNode(7)

printLeavesByLevel(root)
