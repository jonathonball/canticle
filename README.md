# Canticle
Canticle is a command-line music streaming application.  It uses [Blessed](http://blessedjs.org/) as front-end for [youtube-dl](https://rg3.github.io/youtube-dl/) and [mplayer](http://www.mplayerhq.hu/design7/news.html).  Canticle does not download or store any music on your computer.

# NOTICE
This application has not reached a release milestone.  I don't think you should use it yet.

![demo gif](https://i.imgur.com/252VjQR.gif "Canticle in action")

## Features
* Create and manage playlists of on-line videos
* Audio playback that iterates through the current playlist

## Coming Soon
* Keyboard shortcuts for controlling playback
* Ability to sort tracks
* Detailed playback information
* Retrieve description data

## Coming Eventually
* Load and store existing public on-line playlists
* Search for songs in application

## Installation
* `$ git clone git@github.com:jonathonball/canticle.git`
* `$ cd canticle`
* `$ npm install`

## Dependencies
* mplayer
* sqlite3

## License
* MIT

## Usage
Though there is some mouse support, Canticle is primarily controlled by text commands.

* `add playlist [name]` - add a new playlist to the playlist manager
* `add track [URL]` - add a new track to the open playlist
* `play` - Opens a playlist, if a playist is open, play the highlighted track
  * `play [integer]`
  * `play track [integer]` - Opens a specific track in the playlist by index
  * `play [name]`
  * `play playlist [name]` - Opens a specific track in the playlist manager by name
* `shuffle` - Toggles track shuffling
* `next` - Highlight the next track to be played
* `pause` - Toggle pausing playback
* `quit` - Quit the application
