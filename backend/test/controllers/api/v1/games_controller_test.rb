require 'test_helper'

module Api
  module V1
    class GamesControllerTest < ActionDispatch::IntegrationTest
      test "should get next move with valid board" do
        # Initial board state (standard start)
        # D4(27): White, E4(28): Black, D5(35): Black, E5(36): White
        # Board string representation
        board = "2" * 64
        board[27] = "1"
        board[28] = "0"
        board[35] = "0"
        board[36] = "1"
        
        # Turn 0 (Black)
        post next_move_api_v1_games_url, params: { board: board, turn: 0 }, as: :json
        
        assert_response :success
        json_response = JSON.parse(response.body)
        
        assert_includes json_response, "next_move"
        
        # 19 (D3), 26 (C4), 37 (F5), 44 (E6) are typical opening moves for Black
        # Depending on the logic, one of these should be returned.
        # Based on previous execution, it returns 19.
        assert_includes [19, 26, 37, 44], json_response["next_move"]
      end

      test "should return error for invalid board length" do
        post next_move_api_v1_games_url, params: { board: "000", turn: 0 }, as: :json
        assert_response :unprocessable_entity
      end

      test "should return error when C++ executable is missing" do
        # Temporarily rename executable to simulate missing file
        exe_path = Rails.root.join('othelloai_logic', 'othello')
        File.rename(exe_path, exe_path.to_s + ".bak") if File.exist?(exe_path)

        begin
          board = "2" * 64
          post next_move_api_v1_games_url, params: { board: board, turn: 0 }, as: :json
          assert_response :internal_server_error
        ensure
          # Restore executable
          File.rename(exe_path.to_s + ".bak", exe_path) if File.exist?(exe_path.to_s + ".bak")
        end
      end
    end
  end
end
