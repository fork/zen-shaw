zen-shaw gh-pages documentation
===============================

Actually it is horrible to do anything manually when you can do it automatically. So here's a little script that generates the documentation with [docco](http://jashkenas.github.io/docco/) from the `src/Zen.js` that's in the master-branch.

Step-By-Step-Guide
------------------
1.  *(master)* change anything in the src/Zen.js
2.  *(master)* `$ git commit -a -m 'yay'`
3.  `$ git checkout gh-pages`
4.  *(gh-pages)* `$ ./gen.sh`
5.  *(gh-pages)* `$ git commit -a -m 'updated documentation'`
6.  `$ git push`
