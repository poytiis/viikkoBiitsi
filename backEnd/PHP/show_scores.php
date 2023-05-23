<?php
include 'connect_to_database.php';
include 'add_cors_headers.php';
$conn = connect_database();

$post_ids_r = $conn->query("SELECT * from wpzl_postmeta WHERE post_id in (SELECT post_id FROM wpzl_postmeta WHERE meta_key ='_field_39')");
$result_objects = array();

while($row = $post_ids_r->fetch_object()) {

    $data = $row->meta_value;
    $meta_id = $row->meta_id;
    $post_id = $row->post_id;
    $meta_key = $row->meta_key;

    $object_string = '{ "meta_id":"'. $meta_id. '", "post_id":"'. $post_id. '", "meta_key":"'. $meta_key. '", "meta_value":"'. $data. '"}';
    array_push($result_objects, $object_string); 
}

$object_count = count($result_objects);

echo '{"data": [';

for($i = 0; $i < $object_count; $i++) {
    echo $result_objects[$i];

    if($i != ($object_count - 1)){
        echo ",";
    }
}

echo "]}";

?>