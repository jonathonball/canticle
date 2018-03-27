# Canticle
Canticle is a command-line music streaming application.  It uses [Blessed](http://blessedjs.org/) as front-end for [youtube-dl](https://rg3.github.io/youtube-dl/) and [mplayer](http://www.mplayerhq.hu/design7/news.html).  Canticle does not download or store any music on your computer.

# NOTICE
This application has not reached a release milestone.  I don't think you should use it yet.

## Features
* Uses the entire terminal window to provide a friendly user interface.
* Command console accepts text commands for managing playlists and playback.
* Add URL's from popular streaming sites such as YouTube to local playlists.
* Option to shuffle playback.

## What's New
* Keyboard shortcuts for seeking through tracks.
* Keyboard shortcuts for controlling in-app volume.
* Command to validate that existing tracks in a playlist have valid streams.
  * `validate playlist example`
* User specific options can be set in `~/.config/canticle/*.json`.
* Neuron now available in the backend for handling large batch jobs.

## Coming Soon
* Ability to import existing public YouTube playlists.
* Interactive `help` command
* Add tracks to playlists via CLI
* `dj` command for quickly starting playback
* Ability to delete tracks from the app
* Improved Now Playing widget

## Coming Eventually
* Keyboard shortcuts for controlling playback.
* mysql and postgres support.
* VIM Style keybindings.
* mpv and VLC support.
* Move tracks between playlists.
* Trash playlist that acts like a recycle bin.
* Export tracks to text file.
* Desktop notications.
* Time-weighted shuffle.

## Dependencies
* mplayer
* sqlite3

## Installation
* `$ git clone git@github.com:jonathonball/canticle.git`
* `$ cd canticle`
* `$ npm install`

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

## License
* MIT

