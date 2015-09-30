<?php

require 'recipe/common.php';

// Define a server for deployment.
// Let's name it "prod" and use port 22.
 server('recette5', '10.21.5.17', 22)
     ->user('root')
     ->forwardAgent() // You can use identity key, ssh config, or username/password to auth on the server.
     ->stage('recette5')
     ->env('deploy_path', '/home/web/test'); // Define the base path to deploy your project to.

// Specify the repository from which to download your project's code.
// The server needs to have git installed for this to work.
// If you're not using a forward agent, then the server has to be able to clone
// your project from this repository.
set('repository', 'git@github.com:cedricjimenez/redchrome.git');
