<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';
include 'update_ranking_lists.php';

// mysqli_report(MYSQLI_REPORT_ERROR);

class Player {
    public $name;
    public $pool;
    public $plus_minus_points;
    public $ranking_points;
    public $pool_ranking;

    function __construct($name, $pool, $plus_minus_points){
        $name_uppercase = ucwords(strtolower($name));
        $this->name = htmlspecialchars($name_uppercase);
        $this->pool = $pool;
        $this->plus_minus_points = $plus_minus_points;
    }

    function calculate_ranking_points($pool_ranking) {
        $this->ranking_points = 20.1 - 0.9 * ($this->pool - 1) - ($pool_ranking - 1) + 0.05 * $this->plus_minus_points;
        $this->pool_ranking = $pool_ranking;      
    }

    function calculate_shared_ranking_points($pool_ranking_1, $pool_ranking_2) {
        if(abs($pool_ranking_1 - $pool_ranking_2) == 1){
          $average = ($pool_ranking_1 + $pool_ranking_2) / 2;
        }else{
          $average = $pool_ranking_1 + 1;
        }

        $this->ranking_points = 20.1 - 0.9 * ($this->pool - 1) - ($average - 1) + 0.05 * $this->plus_minus_points;
        $this->pool_ranking = $pool_ranking_1;

    }
}

function take_backup(mysqli $conn) {
    $delete_query = "DELETE FROM viikon_tulokset_varmuuskopio;";

    $conn->query($delete_query);

    $query = "SELECT * FROM viikon_tulokset";
    $score_rows_r = $conn->query($query);
    $score_rows = $score_rows_r->fetch_all();
    $insert_query = "INSERT INTO viikon_tulokset_varmuuskopio VALUES ";
    foreach($score_rows as $score_row) {
        $insert_query =  $insert_query . "($score_row[0], '$score_row[1]', '$score_row[2]', $score_row[3], $score_row[4], $score_row[5], $score_row[6], $score_row[7], $score_row[8]),";

    }
    $insert_query = rtrim($insert_query, ",");
    $conn->query($insert_query);
}

function check_all_pools_exist(mysqli $conn): string {
    $error_message = '';
    $year = (int)date("Y");
    $latest_week_q= "SELECT viikko FROM viikon_tulokset WHERE vuosi=$year ORDER BY viikko DESC LIMIT 1";
    if($latest_week_r = $conn->query($latest_week_q)) {
        $latest_week = (int)$latest_week_r->fetch_object()->viikko;
        if( $latest_week == (int)date('W')) {
            $error_message = 'viikon tulokset ovat jo laskettu';
            return $error_message;
        }
        $latest_week_r->free();
    }

    $men = array();
    $women = array();

    $post_ids_q = "SELECT post_id FROM wpzl_postmeta WHERE meta_key='_form_id' AND meta_value=5";
    $post_ids_r = $conn->query($post_ids_q);

    while($post_id_row = $post_ids_r->fetch_object()) {
        $post_id = (int)$post_id_row->post_id;
        $serie_q = "SELECT meta_value FROM wpzl_postmeta WHERE post_id =$post_id AND meta_key='_field_38'";
        $pool_q = "SELECT meta_value FROM wpzl_postmeta WHERE post_id =$post_id AND meta_key= '_field_39'";

        $serie = $conn->query($serie_q)->fetch_object()->meta_value;
        $pool = $conn->query($pool_q)->fetch_object()->meta_value;

        if($serie == 'Miehet'){
            array_push($men, $pool);
        }else if ($serie == 'Naiset'){
            array_push($women, $pool);
        }
    }

    $post_ids_r->free();

    asort($men);
    asort($women);

    $pool_iter = 1;

    foreach($men as $men_pool) {
        if($men_pool != $pool_iter) {
            $error_message = $error_message. 'lohko '. (string)$pool_iter. ' puuttuu miehissa. ';
            break;
        }

        $pool_iter += 1;
    }

    $pool_iter = 1;
    foreach($women as $women_pool) {
        if($women_pool != $pool_iter) {
            $error_message = $error_message. 'lohko '. (string)$pool_iter. ' puuttuu naisista. ';
            break;
        }

        $pool_iter += 1;
    }

    return $error_message;
}

function calculate_ranking_points(mysqli $conn): void {
    function fetch_player_fields_str( array $pool_r, int $row_index): string {
        $field = $pool_r[$row_index]->meta_value;
        return strtolower($field);
    }

    function fetch_player_fields_int(array $pool_r, int $row_index): int {
        return  (int)$pool_r[$row_index]->meta_value;
    }

    function compare_players_scores(Player $player_1, Player $player_2): int {
        return ($player_1->plus_minus_points > $player_2->plus_minus_points) ? -1 : 1;
    }

    $scores_week = null;

    $post_id_q="SELECT post_id FROM wpzl_postmeta WHERE meta_key='_form_id' AND meta_value=5";
    $post_id_r = $conn->query($post_id_q);

    while($post_id_row = $post_id_r->fetch_object()) {
        $post_id = (int)$post_id_row->post_id;
        $meta_name_q = "SELECT meta_value FROM wpzl_postmeta WHERE post_id = $post_id ORDER BY meta_id";
        $scores_r = $conn->query($meta_name_q);
        $scores = [];
        while($score_row = $scores_r->fetch_object()) {
            array_push($scores, $score_row);
        }
        $serie =  htmlspecialchars($scores[0]->meta_value);
       
        $player_1 = new Player(
            fetch_player_fields_str($scores, 2),
            fetch_player_fields_int($scores, 1),
            fetch_player_fields_int($scores, 3)
        );

        $player_2 = new Player(
            fetch_player_fields_str($scores, 4),
            fetch_player_fields_int($scores, 1),
            fetch_player_fields_int($scores, 5)
        );

        $player_3 = new Player(
            fetch_player_fields_str($scores, 6),
            fetch_player_fields_int($scores, 1),
            fetch_player_fields_int($scores, 7)
        );

        $player_4 = new Player(
            fetch_player_fields_str($scores, 8),
            fetch_player_fields_int($scores, 1),
            fetch_player_fields_int($scores, 9)
        );

        $player_list = array($player_1, $player_2, $player_3, $player_4);
        usort($player_list, 'compare_players_scores');

        $player_list_i = 0;
        while ($player_list_i <= 3) {
            $same_ponts = 0;
            foreach($player_list as $player) {
                if($player->plus_minus_points == $player_list[$player_list_i]->plus_minus_points) {
                    $same_ponts++;
                }
            }

            $same_ponts -=1;
            if($same_ponts != 0) {
                $shared_ranking = $player_list_i + 1;
                for($same_points_i = 0; $same_points_i <= $same_ponts; $same_points_i++) {
                    $player_list[$player_list_i]->calculate_shared_ranking_points($shared_ranking, $shared_ranking + $same_ponts);
                    $player_list_i++;
                }

            } else {
                $player_list[$player_list_i]->calculate_ranking_points($player_list_i + 1);
                $player_list_i++;
            }     
        }

        $week = (int)date('W');
        $year = (int)date("Y");

        $latest_week = $week;
        $week_query = "SELECT viikko FROM viikon_tulokset WHERE vuosi=$year ORDER BY viikko DESC LIMIT 1";
        $latest_week_object = $conn->query($week_query)->fetch_object();
        if ($latest_week_object) {
          $latest_week = $latest_week_object->viikko;
        }
        if ($latest_week != 0) {
          $week = $latest_week + 1;
        } else {
          $day = date('w');
          if ($day == 0 || $day == 1) {
            $week = $week - 1;
          } else if ($day == 2 ) {
            $hour = (int)date('H');
            if ($hour < 15) {
              $week = $week - 1;
            }
          }
        }

        if($scores_week == null) {
            $scores_week = $week;
        }

        foreach($player_list as $player) {
            if($player->name == '' || $player->name == '-') {
                continue;
            }

            $insert_scores_stmt = $conn->prepare("INSERT INTO  viikon_tulokset VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?)");
            if(!$insert_scores_stmt) {
                echo $conn->error;
                die('invalid insert query');
            }

            $insert_scores_stmt_bind = $insert_scores_stmt->bind_param('ssiiiidi', $player->name, $serie, $scores_week, $player->pool, $player->pool_ranking, $player->plus_minus_points, $player->ranking_points, $year);
            if(!$insert_scores_stmt_bind) {
                die('invalid binding');    
            }

            $insert_scores_stmt_executed = $insert_scores_stmt->execute();
            if(!$insert_scores_stmt_executed) {
                die('failed to execute query');
            }
        }
    }

    $post_id_r->free();
}


$conn = connect_database();
$conn->begin_transaction();

$update_only_param = $_GET['update_only'];
$update_only = $update_only_param ==  'true';

try {
  if (!$update_only) {   
    $error_message = check_all_pools_exist($conn);
    if ($error_message != '') {
        http_response_code(500);
        echo '{"data": "'. $error_message. '"}';      
        die;
    }

    take_backup($conn);
    calculate_ranking_points($conn);
  }
   
    $new_players = update_ranking_lists($conn, $update_only);
    echo '{"data": "'. $new_players. '"}';   
    $conn->commit();
    $conn->close();

} catch (mysqli_sql_exception $exception) {
    $conn->rollback();
}
?>
