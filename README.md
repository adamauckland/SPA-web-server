SPA-web-server
==============

NodeJS based web server to serve either static content or index.html

Problem:

  Single Page Applications using the HTML5 History API modify the browser URL.
  
  Performing a refresh caused a server lookup to a file which didn't exist.
  
  I needed a lightweight flat HTTP server which sent an index.html where the file did not exist, or a file if it did.
  
  

I don't know if Express has something like this in it already, it only took 15 minutes to bash together.



Requires
========

node.js
express

