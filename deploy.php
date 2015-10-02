<?php

require 'recipe/common.php';

const RECETTE_NUM = 5;

// Define a server for deployment.
// Let's name it "prod" and use port 22.
server('recette5', '10.21.' . RECETTE_NUM . '.17', 22)
  ->user('root')
  ->forwardAgent()// You can use identity key, ssh config, or username/password to auth on the server.
  ->stage('recette5')
  ->env('deploy_path', '/home/web/redchrome'); // Define the base path to deploy your project to.

// Specify the repository from which to download your project's code.
// The server needs to have git installed for this to work.
// If you're not using a forward agent, then the server has to be able to clone
// your project from this repository.
set('repository', 'git@github.com:cedricjimenez/redchrome.git');

task('deploy', [
  'deploy:prepare',
  'deploy:release',
  'deploy:update_code',
]);

task('reload:fpm', function ()
{
  run('sudo /usr/sbin/service php5-fpm reload');
});

task('reload:hhvm', function ()
{
  run('sudo /usr/sbin/service hhvm restart');
});

task('reload:memcache', function ()
{
  $memcacheServers = [
    "10.21." . RECETTE_NUM . ".10",
    "10.21." . RECETTE_NUM . ".11",
    "10.21." . RECETTE_NUM . ".13",
    "10.21." . RECETTE_NUM . ".14",
  ];
  $restartCommand = '/usr/sbin/service memcached restart';

  run("sudo $restartCommand");

  foreach($memcacheServers as $memcacheServer) {
    run("ssh root@$memcacheServer $restartCommand");
    writeln("<info>Memcached restarted on $memcacheServer</info>");
  }
});

task('reload:xcache', function ()
{
  $xcacheServers = [
    "10.21." . RECETTE_NUM . ".10",
    "10.21." . RECETTE_NUM . ".11",
    "10.21." . RECETTE_NUM . ".13",
    "10.21." . RECETTE_NUM . ".14",
  ];

  foreach($xcacheServers as $xcacheServer) {
    $restartCommand = "wget --http-user=apc --http-password=vpgapc -O - -q --no-cache 'http://$xcacheServer/xcachevpg/cacher/' --post-data='clearcache=clear&type=0&cacheid=0' | grep '\"pvalue\"'";
    run("$restartCommand");
    writeln("<info>Xcache restarted on $xcacheServer</info>");
  }
});

task('reload', [
  'reload:hhvm',
  'reload:memcache',
  'reload:fpm'
]);

after('deploy', 'reload');
after('rollback', 'reload');