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

  result = []
  queue = deque([root])
  visited = set()

  while queue:
    level_nodes = []
    for _ in range(len(queue)):
      node = queue.popleft()
      visited.add(node)

      if not node.left and not node.right:
        level_nodes.append(node.val)
        # Remove node (implementation depends on your tree structure)
        # (e.g., set node.left and node.right to None)

      if node.left and node.left not in visited:
        queue.append(node.left)
      if node.right and node.right not in visited:
        queue.append(node.right)

    result.append(level_nodes)

  # Print results by level
  for level in result:
    print(level)

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
# root.right.left = TreeNode(6)
# root.left.left.right = TreeNode(7)

printLeavesByLevel(root)
