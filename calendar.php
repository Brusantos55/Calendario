<?php
    $mysqli = new mysqli("localhost", "root", "", "pruebas");

    $query = "SELECT ID, nombre, precio, lugar, foto, DATE_FORMAT(Fecha, '%Y-%m-%d') as sFecha, DATE_FORMAT(Fecha,'%H:%i') as sHora FROM Actividades";
    $result = $mysqli->query($query);

    $cantidad = $result->num_rows;
    for($i=0;$i<$cantidad;$i++){
         $consulta[$i] = $result->fetch_array(MYSQLI_ASSOC);
    }

    header('Content-Type: application/json');
    
    $json=json_encode($consulta);// , JSON_FORCE_OBJECT
    echo $json;
?>