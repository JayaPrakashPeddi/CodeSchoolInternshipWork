<?php
require __DIR__ . "/pdo.php";

class DB{
    public $query = '';
    private  $pdo = null;
    private $statement = null;
function __construct(){
    $this->pdo = getPDO();
}

public function query($query){
    $this->query=$query;
    return $this; // for chaining ex: query("SELECT * FROM users")->getObject();
}

public function execute($params=[]){
    $this->statement = $this->pdo->prepare($this->query);
    return $this->statement->execute($params);
}

public function getObject($params=[]){
    $this->execute($params);
    return $this->statement->fetch(PDO::FETCH_ASSOC);
}

public function allObjects($params=[]){
    $this->execute($params);
    return $this->statement->fetchAll(PDO::FETCH_ASSOC);
}
}
?>