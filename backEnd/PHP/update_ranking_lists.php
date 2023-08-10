<?php

function update_ranking_lists(mysqli $conn, bool $update_only): string {
    $new_players = '';
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

        if ($play_times == 0) {
            continue;
        }

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
                $log_message = 'Uusi pelaaja: '. $name. ' '; 
                $new_players = $new_players. $name. ', ';

                if (!$update_only) {
                    $log_stmt = $conn->prepare("INSERT INTO lokitiedot VALUES (DEFAULT, ?, ?)");
                    $log_stmt->bind_param('ss', $time_stamp, $log_message);
                    if (!$log_stmt->execute()) {
                        die;
                    }
                }   
            }
          
            if($serie == 'Miehet') {
                $scores_stmt = $conn->prepare("INSERT INTO kokonaistulokset_miehet VALUES(DEFAULT, ?, ?, ?, ?)");
            } else if ($serie == 'Naiset') {
                $scores_stmt = $conn->prepare("INSERT INTO kokonaistulokset_naiset VALUES(DEFAULT, ?, ?, ?, ?)");
            }

            $scores_stmt->bind_param('sddd', $name, $scores_week_1, $scores_week_2, $scores_total);
            if(!$scores_stmt->execute()) {
                die;
            }
               
        } else {
            $scores_week_1 = $scores[0]['serie_scores'];
            $scores_week_2 = $scores[1]['serie_scores'];

            $scores_total = $scores_week_1;
            if($scores_count == 2) {
                $scores_total = $scores_week_1 + $scores_week_2;
            } 

            if($serie == 'Miehet') {
                $scores_stmt = $conn->prepare("INSERT INTO kokonaistulokset_miehet VALUES(DEFAULT, ?, ?, ?, ?)");
            } else if ($serie == 'Naiset') {
                $scores_stmt = $conn->prepare("INSERT INTO kokonaistulokset_naiset VALUES(DEFAULT, ?, ?, ?, ?)");
            } else {
                echo 'Invalid Serie!';
            }

            
            $scores_stmt->bind_param('sddd', $name, $scores_week_1, $scores_week_2, $scores_total);
            if(!$scores_stmt->execute()) {
                die;
            }
        }  
    }

    if (!$update_only) {
        $delete_q = "DELETE FROM wpzl_postmeta WHERE post_id in (SELECT post_id FROM wpzl_postmeta WHERE meta_key='_form_id' AND meta_value=5)";
        $conn->query($delete_q);
    }

    $name_r->free();
    return rtrim($new_players, ", ");
}

?>