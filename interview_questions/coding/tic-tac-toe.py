# Define player markers
PLAYER_X = "X"
PLAYER_O = "O"
EMPTY_SPACE = " "

# Function to initialize the game board
def initialize_board():
  """
  Initializes the game board with empty spaces.
  Returns:
      list: A list representing the game board with 9 elements (empty spaces).
  """
  return [EMPTY_SPACE] * 9

# Function to display the game board
def display_board(board):
  """
  Displays the current state of the game board.
  Args:
      board: A list representing the game board.
  """
  for i in range(3):
    print(f"| {board[i*3]} | {board[i*3+1]} | {board[i*3+2]} |")
    if i < 2:
      print("-+-+-+-")

# Function to check if a player has won
def check_win(board, player):
  """
  Checks if a player has achieved a winning combination on the board.
  Args:
      board: A list representing the game board.
      player: The player's marker (X or O).
  Returns:
      bool: True if the player has won, False otherwise.
  """
  win_conditions = ((0, 1, 2), (3, 4, 5), (6, 7, 8),  # Rows
                    (0, 3, 6), (1, 4, 7), (2, 5, 8),  # Columns
                    (0, 4, 8), (2, 4, 6))  # Diagonals
  for condition in win_conditions:
    if all(board[i] == player for i in condition):
      return True
  return False

# Function to check if the board is full
def is_board_full(board):
  """
  Checks if all spaces on the board are occupied.
  Args:
      board: A list representing the game board.
  Returns:
      bool: True if the board is full, False otherwise.
  """
  return all(space != EMPTY_SPACE for space in board)

# Function to get a valid player move
def get_player_move(board):
  """
  Prompts the player for a valid move and returns the corresponding index on the board.
  Args:
      board: A list representing the game board.
  Returns:
      int: The index of the chosen space on the board.
  """
  while True:
    try:
      move = int(input("Enter your move (1-9): ")) - 1
      if 0 <= move <= 8 and board[move] == EMPTY_SPACE:
        return move
      else:
        print("Invalid move. Try again.")
    except ValueError:
      print("Invalid input. Please enter a number between 1 and 9.")

# Function to make a player move on the board
def make_player_move(board, player, move):
  """
  Places the player's marker on the chosen space of the board.
  Args:
      board: A list representing the game board.
      player: The player's marker (X or O).
      move: The index of the chosen space on the board.
  """
  board[move] = player

# Function to check if the game has ended (win or tie)
def is_game_over(board):
  """
  Checks if the game has ended due to a win or a tie.
  Args:
      board: A list representing the game board.
  Returns:
      tuple: (bool, str): A tuple containing a flag indicating the game over state 
                           and a message (winner or tie).
  """
  for player in (PLAYER_X, PLAYER_O):
    if check_win(board, player):
      return True, f"{player} wins!"
  if is_board_full(board):
    return True, "It's a tie!"
  return False, None

def main():
  """
  The main function that runs the tic-tac-toe game.
  """
  board = initialize_board()
  current_player = PLAYER_X  # Start with player X
  game_over = False

  while not game_over:
    # Display the board
    display_board(board)

    #
