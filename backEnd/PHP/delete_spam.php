<?php
include 'connect_to_database.php';
$conn = connect_database();
$post_ids_r = $conn->query("SELECT post_id FROM wpzl_postmeta WHERE meta_key = '_field_46' AND meta_value LIKE '%CANAD%'");
while($post_id_row = $post_ids_r->fetch_object()) {
    $post_id = $post_id_row->post_id;

    $delete_stmt = $conn->prepare("DELETE FROM wpzl_postmeta where post_id = ?");
    $delete_stmt->bind_param('s', $post_id);
    if($delete_stmt->execute()) {
        die;
    }
}

?>