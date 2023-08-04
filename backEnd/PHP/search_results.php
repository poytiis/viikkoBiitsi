<?php
include 'connect_to_database.php';
$conn = connect_database();
header("Access-Control-Allow-Origin: *");


$week = (int)$_GET['week'];
$serie = $_GET['serie'];
$year =(int) $_GET['year'];


$search_stmt = $conn->prepare("SELECT nimi, viikko, lohko, sijoitus, pelatut_pisteet, sarja_pisteet FROM viikon_tulokset  WHERE sarja = ? AND viikko = ? AND vuosi = ? ORDER BY lohko,sijoitus");
$search_stmt->bind_param('sii', $serie, $week, $year);
$search_stmt->execute();
$search_stmt->bind_result($name, $week, $pool, $ranking, $played_scores, $serie_scores);

try {
$display_string = '';
$counter = 0;
$first_round = 1;

while($search_stmt->fetch()) {
  if ($counter == 0) {
    if($first_round == 1){
        $display_string .= "<h3 class='table-header'>Tulokset viikolta: $week, Lohko: $pool</h3>"; 
        $first_round =0;
    }else{
        $display_string .= "<h3 class='table-header'>Lohko: $pool</h3>";  
    }
   
    $display_string .= "<table class='scores'>";
    $display_string .= "<tr>";
    $display_string .= "<th class='rank'>Sijoitus</th>";
    $display_string .= "<th class='name'>Nimi</th>";
    $display_string .= "<th class='plusminus'>+- pisteet</th>";
    $display_string .= "<th class='points'>sarjapisteet</th></tr>";
    
    $display_string .= "<tr><td>$ranking</td>";
    $display_string .= "<td>$name</td>";
    $display_string .= "<td>$played_scores</td>";
    $display_string .= "<td>$serie_scores</td></tr>";
    $counter+=1;
  }
  else if($counter == 3){
    $display_string .= "<tr><td>$ranking</td>";
    $display_string .= "<td>$name</td>";
    $display_string .= "<td>$played_scores</td>";
    $display_string .= "<td>$serie_scores</td></tr>";
    $display_string .=  "</table>";
    $counter = 0;
  }else {
    $display_string .= "<tr><td>$ranking</td>";
    $display_string .= "<td>$name</td>";
    $display_string .= "<td>$played_scores</td>";
    $display_string .= "<td>$serie_scores</td></tr>";
    $counter+=1;
  }

}

echo $display_string;

}
catch(Exception $e) {
echo $e->getMessage() . "<br/>";
   while($e = $e->getPrevious()) {
      echo 'Previous exception: '.$e->getMessage() . "<br/>";
   }
}


?>