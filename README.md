blessed-life
============

This is a simple simulation of Conway's game of life. It's written in javascript for nodejs and targets the command line. It utilizes the following nodejs modules:

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

### Further Reading

If you want to know a bit more about blessed-life, visit the [wiki]. Also, feel free to read more about [Conway's game of life][gof] if you're interested in the theory.

  [commander]: https://npmjs.org/package/commander
  [blessed]: https://npmjs.org/package/blessed
  [nodejs]: http://nodejs.org/
  [asciinema]: http://asciinema.org
  [asciicast]: http://asciinema.org/a/5984
  [wiki]: https://github.com/Coalman/blessed-life/wiki
  [gof]: http://en.wikipedia.org/wiki/Conway's_Game_of_Life