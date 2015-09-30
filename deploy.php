<?php

require 'recipe/common.php';

// Define a server for deployment.
// Let's name it "prod" and use port 22.
server('recette5', '10.21.5.17', 22)
     ->user('root')
     ->forwardAgent() // You can use identity key, ssh config, or username/password to auth on the server.
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


task('reload:fpm', function () {
        run('sudo /usr/sbin/service php5-fpm reload');
});


task('reload:hhvm', function () {
        run('sudo /usr/sbin/service hhvm restart');
});

task('reload:memcache', function () {
        run('sudo /usr/sbin/service memcached restart');
});


task('reload', [
    'reload:hhvm',
    'reload:memcache',
    'reload:fpm'
]);

after('deploy', 'reload');
after('rollback', 'reload');
