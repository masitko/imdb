<?php 

require_once __DIR__.'/../vendor/autoload.php';

use Silex\Application;
use Saxulum\DoctrineMongoDb\Silex\Provider\DoctrineMongoDbProvider;

$app = new Application();
$app["debug"] = true;

$app->register(new Silex\Provider\ServiceControllerServiceProvider());
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());
$app->register(new Silex\Provider\TwigServiceProvider(), [
    "twig.path" => __DIR__.'/../src/views'
]);
$app->register(new DoctrineMongoDbProvider(), array(
    'mongodb.options' => array(
        'server' => 'mongodb://localhost:27017',
        'options' => array(
//            'username' => 'root',
//            'password' => 'root',
            'db' => 'm-rex'
        )
    )
));

app\Dependencies::configure($app);
app\Routes::configure($app);

$app->run();