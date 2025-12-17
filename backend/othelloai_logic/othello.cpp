#include "ai1.cpp"
#include "board.hpp"
#include "cell_evaluate.hpp"
#include <cctype>
#include <iostream>
#include <stdio.h>
#include <string>

int arr[64];  // Temporary array for board conversion
int t;        // Current turn (0=black, 1=white)

int main(int argc, char *argv[]) {
  // -----------------------------------------
  // API Mode
  // Usage: ./othello [board_string] [turn]
  // board_string: 64-character string of '0'|'1'|'2'
  //   '0' = Empty, '1' = Black, '2' = White
  // turn: 0 (black) or 1 (white)
  // Output: Index (0-63) of the best move
  // -----------------------------------------
  if (argc >= 3) {
    if (std::string(argv[1]).length() != hw2) {
      std::cerr << "Error: Invalid board length." << std::endl;
      return 1;
    }

    // 1. Initialize board and evaluation tables
    init_board();
    evaluate_init();
    board b;

    // 2. Parse board state from command line argument
    std::string s_board = argv[1];
    for (int i = 0; i < hw2; ++i) {
      // Input: '0'=Empty, '1'=Black, '2'=White
      // C++:    0=Empty,   1=Black,   2=White (Aligned)
      char c = s_board[i];
      if (c >= '0' && c <= '2') {
        arr[i] = c - '0';
      } else {
        arr[i] = vacant; // Default to empty
      }
    }
    b.trans_idx(arr);

    // 3. Parse turn from command line argument
    t = std::stoi(argv[2]); // 0 or 1
    // Convert API format (0=Black, 1=White) to internal format (1=Black, 2=White)
    b.player = t + 1;

    // 4. Search for best move (9 ply depth, offset 3 for iterative deepening)
    int mv = search(b, 9, 3);

    // 5. Output result to stdout
    std::cout << mv << std::endl;
    return 0;
  }

  // 引数が足りない場合
  std::cerr << "Usage: ./othello [board_string] [turn]" << std::endl;
  return 1;
}
