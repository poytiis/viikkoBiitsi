<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';
$conn = connect_database();

$post_id_query = "SELECT post_id FROM wpzl_postmeta WHERE meta_key='_form_id' AND meta_value=5";

$post_id_res = $conn->query($post_id_query);
$post_id_rows = $post_id_res->fetch_all();

foreach ($post_id_rows as $post_id_row)  {
    $backup_query = "SELECT post_id FROM syotetyt_tulokset_varmuuskopio WHERE post_id=?";

    $backup_stm = $conn->prepare($backup_query);
    $backup_stm->bind_param('i', $post_id_row[0]);
    $backup_stm->execute();
    $backup_stm->bind_result($backup_post_id);

    $backup_found = false;
    while($backup_stm->fetch()) {
        $backup_found = true;
    };

    if (!$backup_found) {;
        $form_data_query = "SELECT meta_id, post_id, meta_key, meta_value FROM wpzl_postmeta WHERE post_id=?;";
        $fetch_form_data_stm = $conn->prepare($form_data_query);
        $fetch_form_data_stm->bind_param('i', $post_id_row[0]);
        $fetch_form_data_stm->execute();
        $fetch_form_data_stm->bind_result($meta_id, $post_id, $meta_key, $meta_value);
        $meta_ids = $post_ids = $meta_keys = $meta_values = [];

        while($fetch_form_data_stm->fetch()) {
            array_push($meta_ids, $meta_id);
            array_push($post_ids, $post_id);
            array_push($meta_keys, $meta_key);
            array_push($meta_values, $meta_value);
        }

        $row_count = count($meta_ids);

        for($i = 0; $i < $row_count; $i++ ) {
            $insert_query = "INSERT INTO syotetyt_tulokset_varmuuskopio VALUES (DEFAULT, ?, ? ,? ,? , NOW())";
            $insert_stm = $conn->prepare($insert_query);
            $insert_stm->bind_param('iiss', $meta_ids[$i], $post_ids[$i], $meta_keys[$i], $meta_values[$i]);
            $insert_stm->execute();
        }
    } 
}
?>