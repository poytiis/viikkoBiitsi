<?php
$username = "";
$password = "";
$hostname = "";
$database= "";

//  $conn = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
//   // set the PDO error mode to exception
//   $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if(!$conn->set_charset("utf8mb4")) {
    die("Failed to set UTF-8");
}
$score_array= array();
$name_query= "SELECT DISTINCT(nimi)  FROM viikon_tulokset WHERE sarja='Naiset'";

$names_res = $conn->query($name_query);
while($name_row = $names_res->fetch_object()) {
    $name = $name_row->nimi;
    // $score_query="SELECT sarja_pisteet FROM viikon_tulokset WHERE nimi=? and viikko<>0 and vuosi=2022 ORDER BY sarja_pisteet DESC LIMIT 6";
    // $score_stmt = $conn->prepare($score_query);
    // $score_stmt->bind_param('s', $name);
    // $score_stmt->execute();
    // $score_res = $score_stmt->get_result();
    $q = "SELECT sarja_pisteet FROM viikon_tulokset WHERE nimi='" . $name . "'and viikko<>0 and vuosi=2022 ORDER BY sarja_pisteet DESC LIMIT 6";
    $score_res =  $conn->query($q);
    $sum = 0;
    while($score_row = $score_res->fetch_object()) {
        $score = $score_row->sarja_pisteet;
        $sum += (float)$score;
    }
    if($sum != 0) {
        $score_array[$name]=$sum;
    }
}
arsort($score_array);
?>
<div style="overflow-x:auto;">
    <table id='tilasto'>
        <tr>
            <th >Ranking </th>
            <th>Nimi </th>
            <th nowrap="nowrap" >pisteet total</th>

        </tr>
    <?php

    $rank=1;
    foreach($score_array as $k => $v){
        echo '<tr>';

        echo ' <td>'.$rank. ' </td>';
        echo ' <td>'.$k. ' </td>';
        echo ' <td>'.$v. ' </td>';




        echo '<tr>';
        $rank+=1;
    }
    ?>
    </table>
</div>