<?php 

require_once __DIR__.'/../vendor/autoload.php';

use Silex\Application;


$app = new Application();
$app["debug"] = true;

$app->register(new Silex\Provider\ServiceControllerServiceProvider());

app\Dependencies::configure($app);
app\Routes::configure($app);

$app->run();