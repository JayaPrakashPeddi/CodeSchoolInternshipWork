<?php
require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../utils/functions.php";

class vehicleControllers
{
    private $db = null;
    function __construct(){
        $this->db = new DB();
    }

    public function listVehicles(){
        $data = $this->db->query("SELECT * FROM vehicles")->getAll();
        return sendResponse(true,"vehicle details fetched!!",[],$data);
    }

    public function getVehicleDetails($id){
        $data = $this->db->query("SELECT * FROM vehicles WHERE id=:id")->get([":id"=>$id]);
        return sendResponse(true,"vehicle details fetched!!",[],$data);
    }

    public function addVehicle($brand,$model,$numberPlate,$price,$fileName){
        $query = "INSERT INTO vehicles (brand,model,number_plate,price_per_day,photo) VALUES (:brand,:model,:numberPlate,:price,:photo)";
        $this->db->query($query)->execute([
            ":brand"=>$brand,
            ":model"=>$model,
            ":numberPlate"=>$numberPlate,
            ":price"=>$price,
            "photo"=>$fileName
        ]);
        return sendResponse(true,"vehicle inserted successfully!!");
    }

    public function deleteVehicle($id){
        $this->db->query("DELETE FROM vehicles WHERE id=:id")->execute([":id"=>$id]);
        return sendResponse(true,"vehicle deleted!!");
    }

}