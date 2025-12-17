#include "board.hpp"
#include "cell_evaluate.hpp"
#include <algorithm>
#include <iostream>
#include <stdio.h>
#include <unordered_map>
#include <vector>

#define inf 1000000000
#define bonus 100

// Transposition tables for move ordering and caching
// Used to store previously evaluated positions for faster search
unordered_map<board, int, board::hash> transpose_table;
unordered_map<board, int, board::hash> former_transpose_table;

// Calculate evaluation for move ordering
// Uses previous search results to prioritize better moves first
int moveordering_evaluate(const board &b) {
  auto it = former_transpose_table.find(b);
  if (it != former_transpose_table.end()) {
    return bonus - it->second;
  }
  return -evaluate(b);
}

// Nega-alpha search algorithm (variant of minimax with alpha-beta pruning)
// Returns the evaluation score for the current position
int nega_alpha(board b, int depth, bool passed, int alpha, int beta) {
  auto it = transpose_table.find(b);
  if (it != transpose_table.end())
    return it->second;

  if (depth == 0)
    return evaluate(b);

  vector<board> child_nodes;
  for (int i = 0; i < hw2; ++i) {
    if (b.legal_place(i)) {
      board nb = b.move(i);
      nb.value = moveordering_evaluate(nb);
      child_nodes.push_back(nb);
    }
  }

  if (child_nodes.empty()) {
    if (passed)
      return evaluate(b);
    b.player = 3 - b.player;
    return -nega_alpha(b, depth, true, -beta, -alpha);
  }

  sort(child_nodes.begin(), child_nodes.end());

  int max_score = -inf;
  for (const board &nb : child_nodes) {
    int g = -nega_alpha(nb, depth - 1, false, -beta, -alpha);
    if (g >= beta)
      return g;
    alpha = max(alpha, g);
    max_score = max(max_score, g);
  }

  transpose_table[b] = max_score;
  return max_score;
}

// Iterative deepening search
// Searches from (depth-offset) to depth, using results from shallower searches
// to improve move ordering in deeper searches
// Returns the best move as an index (0-63), or -1 if no legal move
int search(board b, int depth, int offset) {
  int start = std::max(1, depth - offset);
  int res = -1;

  for (int d = start; d <= depth; ++d) {
    int alpha = -inf, beta = inf;
    int best = -1;

    for (int coord = 0; coord < hw2; ++coord) {
      if (!b.legal_place(coord))
        continue;

      int score = -nega_alpha(b.move(coord), d - 1, false, -beta, -alpha);

      if (score > alpha) {
        alpha = score;
        best = coord;
      }
    }

    res = best;

    // 今回の探索結果を次回の ordering 用に回す
    transpose_table.swap(former_transpose_table);
    transpose_table.clear();
  }

  return res;
}
