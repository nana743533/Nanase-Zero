#include "ai1.cpp"
#include "board.hpp"
#include "cell_evaluate.hpp"
#include <cctype>
#include <iostream>
#include <stdio.h>
#include <string>

int arr[64];  // 盤面変換用配列
int t;        // 手番

int main(int argc, char *argv[]) {
  // -----------------------------------------
  // APIモード
  // Usage: ./othello [board_string] [turn]
  // board_string: 64文字 '0'|'1'|'2'
  //   '0'=空き, '1'=黒, '2'=白
  // turn: 0(黒) or 1(白)
  // Output: 最善手のインデックス(0-63)
  // -----------------------------------------
  if (argc >= 3) {
    if (std::string(argv[1]).length() != hw2) {
      std::cerr << "Error: Invalid board length." << std::endl;
      return 1;
    }

    // 1. 初期化
    init_board();
    evaluate_init();
    board b;

    // 2. 盤面を復元
    std::string s_board = argv[1];
    for (int i = 0; i < hw2; ++i) {
      char c = s_board[i];
      if (c >= '0' && c <= '2') {
        arr[i] = c - '0';
      } else {
        arr[i] = vacant;
      }
    }
    b.trans_idx(arr);

    // 3. 手番を復元
    t = std::stoi(argv[2]);
    b.player = t + 1;  // API(0=黒,1=白) -> 内部(1=黒,2=白)

    // 4. 探索
    int mv = search(b, 9, 3);

    // 5. 結果出力
    std::cout << mv << std::endl;
    return 0;
  }

  // エラー
  std::cerr << "Usage: ./othello [board_string] [turn]" << std::endl;
  return 1;
}
