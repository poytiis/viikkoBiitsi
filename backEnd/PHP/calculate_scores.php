<?php
include 'connect_to_database.php';

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
        $this->pool_ranking= $pool_ranking_1;
    }

}

function check_all_pools_exist(mysqli $conn): void {
    $year = (int)date("Y");
    $latest_week_q= "SELECT viikko FROM viikon_tulokset WHERE vuosi=$year ORDER BY viikko DESC LIMIT 1";
    if($latest_week_r = $conn->query($latest_week_q)) {
        $latest_week = (int)$latest_week_r->fetch_object()->viikko;
        if( $latest_week == (int)date('W')) {
            echo 'viikon tulokset ovat jo laskettu';
            exit;
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
    $pools_valid = True;

    foreach($men as $men_pool) {
        if($men_pool != $pool_iter) {
            echo 'lohko '. $pool_iter. ' puuttuu miehissa';
            $pools_valid = False;
            break;
        }

        $pool_iter += 1;
    }

    $pool_iter = 1;
    foreach($women as $women_pool) {
        if($women_pool != $pool_iter) {
            echo 'lohko '. $pool_iter. ' puuttuu naisista';
            $pools_valid = False;
            break;
        }

        $pool_iter += 1;
    }

    if(!$pools_valid) {
        exit;
    }

}

function calculate_ranking_points(mysqli $conn): void {
    function fetch_player_fields_str( array $pool_r, int $row_index): string {
        $field = $pool_r[$row_index]['meta_value'];
        return strtolower($field);
    }

    function fetch_player_fields_int(array $pool_r, int $row_index): int {
        return  (int)$pool_r[$row_index]['meta_value'];
    }

    function compare_players_scores(Player $player_1, Player $player_2): int {
        return ($player_1->plus_minus_points > $player_2->plus_minus_points) ? -1 : 1;
    }

    $post_id_q="SELECT post_id FROM wpzl_postmeta WHERE meta_key='_form_id' AND meta_value=5";
    $post_id_r = $conn->query($post_id_q);

    while($post_id_row = $post_id_r->fetch_object()) {
        $post_id = (int)$post_id_row->post_id;
        $meta_name_q = "SELECT meta_value FROM wpzl_postmeta WHERE post_id = $post_id ORDER BY meta_id";
        // $pool_stmt = $conn->prepare("SELECT meta_value FROM wpzl_postmeta WHERE post_id = ? ORDER BY meta_id");
        // if(!$pool_stmt->bind_param('s', $post_id)) {
        //     die('invalid binding');
        // }
        // $pool_stmt->execute();
        // $scores_r = $pool_stmt->get_result();
        $scores_r = $conn->query($meta_name_q);
        $scores = $scores_r->fetch_all(MYSQLI_ASSOC);
        $serie =  htmlspecialchars($scores[0]['meta_value']);

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

        for ($player_list_i = 0; $player_list_i <= 3; $player_list_i++) {
            $same_ponts = 0;
            foreach($player_list as $player) {
                if($player->plus_minus_points == $player_list[$player_list_i]->plus_minus_points) {
                    $same_ponts++;
                }
            }

            $same_ponts -=1;
            if($same_ponts != 0) {
                for($same_points_i = 0; $same_points_i <= $same_ponts; $same_points_i++) {
                    $player_list[$player_list_i]->calculate_shared_ranking_points($player_list_i + 1, $player_list_i + 1 + $same_ponts);
                }

            } else {
                $player_list[$player_list_i]->calculate_ranking_points($player_list_i + 1);
            }     
        }

        $week = (int)date('W');
        $year = (int)date("Y");

        foreach($player_list as $player) {
            if($player->name == '') {
                continue;
            }

            $insert_scores_stmt = $conn->prepare("INSERT INTO  viikon_tulokset VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?)");
            if(!$insert_scores_stmt) {
                echo $conn->error;
                die('invalid insert query');
            }

            $insert_scores_stmt_bind = $insert_scores_stmt->bind_param('ssiiiidi', $player->name, $serie, $week, $player->pool, $player->pool_ranking, $player->plus_minus_points, $player->ranking_points, $year);
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

function update_ranking_lists(mysqli $conn): void {
    $scores_delete_men_q = "DELETE FROM kokonaistulokset_miehet";
    $scores_delete_women_q = "DELETE FROM kokonaistulokset_naiset";
    $conn->query($scores_delete_men_q);
    $conn->query($scores_delete_women_q);

    $year = (int)date("Y");
    $scores_count_q = "SELECT hallinta_arvo FROM viikko_biitsi_hallinta WHERE hallinta_avain = 'laskettavat_kerrat_pisteisiin'";
    $scores_count = (int)$conn->query($scores_count_q)->fetch_object()->hallinta_arvo;

    $name_q = "SELECT DISTINCT (nimi) FROM viikon_tulokset";
    $name_r = $conn->query($name_q);
    while($name_row = $name_r->fetch_object()) {
        $name = $name_row->nimi;
        $scores_stmt = $conn->prepare("SELECT viikko, sarja_pisteet, sarja FROM viikon_tulokset WHERE nimi = ? AND vuosi= ? ORDER BY viikko DESC LIMIT 2");
        $scores_stmt->bind_param('si', $name, $year);
        $scores_stmt->execute();
        $scores_stmt->bind_result($week, $serie_scores, $serie);

        $scores = [];
        while($scores_stmt->fetch()) {
          $score_row = [];
          $score_row['week'] = $week;
          $score_row['serie_scores'] = $serie_scores;
          $score_row['serie'] = $serie;
          array_push($scores, $score_row);
        }

        $serie = $scores[0]['serie'];
        $play_times = count($scores);
        $scores_stmt = null;

        if($play_times == 1) {
            $play_week = $scores[0]['week'];
            $scores_week_1 = $scores[0]['serie_scores'];
            $scores_week_2 = 0;
            $scores_total = $scores_week_1;
            if($scores_count == 2 && $play_week != 0) {
                $scores_total = $scores_week_1 * 2;
            } 
            
            if ($play_week != 0) {
              $time_stamp = date("Y-m-d");
              $log_message = 'Uusi pelaaja: '. $name; 
              echo $log_message;

              $log_stmt = $conn->prepare("INSERT INTO lokitiedot VALUES (DEFAULT, ?, ?)");
              $log_stmt->bind_param('ss', $time_stamp, $log_message);
              if(!$log_stmt->execute()) {
                  die;
              }

            }
          
            if($serie == 'Miehet') {
                $scores_stmt = $conn->prepare("INSERT INTO kokonaistulokset_miehet VALUES(DEFAULT, ?, ?, ?, ?)");
            } else {
                $scores_stmt = $conn->prepare("INSERT INTO kokonaistulokset_naiset VALUES(DEFAULT, ?, ?, ?, ?)");
            }

            $scores_stmt->bind_param('sddd', $name, $scores_week_1, $scores_week_2, $scores_total);
            if(!$scores_stmt->execute()) {
                die;
            }
               
        } else {
            $scores_week_1 = $scores[0]['serie_scores'];
            $scores_week_2 = $scores[1]['serie_scores'];
            $week_2 = $scores[1]['viikko'];

            if($week_2 == 0) {
                $scores_week_2 = 0;
            }

            $scores_total = $scores_week_1;
            if($scores_count == 2) {
                $scores_total = $scores_week_1 + $scores_week_2;
            } 

            if($serie == 'Miehet') {
                $scores_stmt = $conn->prepare("UPDATE kokonaistulokset_miehet SET viikko_1 = ?, viikko_2 = ?, total = ? WHERE nimi = ?");                
            } else {
                $scores_stmt = $conn->prepare("UPDATE kokonaistulokset_naiset SET viikko_1 = ?, viikko_2 = ?, total = ? WHERE nimi = ?");                
            }

            $scores_stmt->bind_param('ddds',  $scores_week_1, $scores_week_2, $scores_total, $name);
            if(!$scores_stmt->execute()) {
                die;
            }
        }

        // $delete_q = "DELETE FROM wpzl_postmeta WHERE post_id in (SELECT post_id FROM wpzl_postmeta WHERE meta_key='_form_id' AND meta_value=5)";
        // $conn->query($delete_q);

    }

    $name_r->free();
}

$conn = connect_database();
$conn->begin_transaction();

$update_only = $_GET['update_only'];

try {
  if ($update_only != 'true') {
    check_all_pools_exist($conn);
    calculate_ranking_points($conn);
  }
   
    update_ranking_lists($conn);
    $conn->commit();
    $conn->close();

} catch (mysqli_sql_exception $exception) {
    $conn->rollback();
}
?>
