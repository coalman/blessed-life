blessed-life
============

This is a simple simulation of Conway's game of life. It's writtin in javascript for nodejs and targets the command line. It utilizes the following nodejs modules:

 - [commander] for the command-line interface.
 - [blessed]: a curses-like library.

Getting Started
---------------

### Installation

Make sure you have [node.js][nodejs] properly installed. Then use `npm` to install:

    $ npm install -g blessed-life

You will probably have to run this command as root like so:

    $ sudo npm install -g blessed-life

### Configuration

You can write configurations for blessed-life in json. Some examples are given in the `example` directory in this repo.

### Running

You can start the program by opening a terminal and entering:

    $ blessed-life

There are many command line switches that can be used (use `-h` or `--help` for more information). You can specify a certain configuration file to use by using the `-c` or `--config` switch:

    $ blessed-life -c example/glider.json

Make sure the value for this switch is a valid path. An [asciicast][asciinema] can be found [here][asciicast].

  [commander]: https://npmjs.org/package/commander
  [blessed]: https://npmjs.org/package/blessed
  [nodejs]: http://nodejs.org/
  [asciinema]: http://asciinema.org
  [asciicast]: http://asciinema.org/a/5984