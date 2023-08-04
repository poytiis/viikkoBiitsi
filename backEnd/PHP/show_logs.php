<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';
$conn = connect_database();

$logs_r = $conn->query("SELECT * FROM lokitiedot");
$result_objects = array();

while($logs_row = $logs_r->fetch_object()) {
    $time_stamp = $logs_row->aikaleima;
    $log_value = $logs_row->merkinta;

    $object_string = '{ "aikaleima":"'. $time_stamp. '","merkinta":"' . $log_value. '"}';
    array_push($result_objects, $object_string);
}

$logs_count = count($result_objects);

echo '{"data": [';

for($i = 0; $i < $logs_count; $i++) {

  echo $result_objects[$i];

  if($i !== $logs_count -1){
    echo ",";
  }
}

echo "]}";

?>