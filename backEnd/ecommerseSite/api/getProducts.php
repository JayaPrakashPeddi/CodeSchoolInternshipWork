<?php
require_once __DIR__ . "/controllers/ProductController.php";

$category = $_GET['category'] ?? 'all';
$offset = $_GET['offset'] ?? 0;
$productControl = new ProductControllers();
echo $productControl->getProducts($category,$offset);
