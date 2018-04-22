# Canticle
Canticle is a command-line music streaming application.  It uses [Blessed](http://blessedjs.org/) as front-end for [youtube-dl](https://rg3.github.io/youtube-dl/) and [mplayer](http://www.mplayerhq.hu/design7/news.html).  Canticle is designed for streaming only and does not download media for off-line playback.  

# NOTICE
This application has not reached a release milestone.  I don't think you should use it yet.

## Features
* Uses the entire terminal window to provide a friendly user interface.
* Command console accepts text commands for managing playlists and playback.
* Add URL's from popular streaming sites such as YouTube to local playlists.
* Option to shuffle playback.
* Keyboard shortcuts for seeking through tracks. (0.0.3)
* Keyboard shortcuts for controlling in-app volume. (0.0.3)
* User specific options can be set in `~/.config/canticle/*.json`. (0.0.3)
* Keyboard shortcuts for controlling playback. (0.0.3)

## What's New (0.0.4)
* Command to validate that existing tracks in a playlist have valid streams.
  * Example: `validate playlist example`
  * Maintenence script can optionally prune invalid tracks
* Ability to import existing public YouTube playlists
* `dj` and `autoplay` commands for quickly starting playback
* Add tracks to playlists via CLI
* WinAMP style title scroll in the Now Playing widget
* Keyboard shortcuts for navigating playlist
  * `PgUp` Select first track in playlist
  * `PgDn` Select last track in playlist
  * `Home` Move playlist selection up the number of visible tracks
  * `End` Move playlist selection down the number of visible tracks

## Coming Soon
* Interactive `help` command
* Ability to delete tracks from the app
* mysql and postgres support.
* VIM Style keybindings.
* mpv and VLC support.
* Move tracks between playlists.
* Trash playlist that acts like a recycle bin.
* Export tracks to text file.
* Desktop notications.
* Time-weighted shuffle.

## Dependencies
* A modern version of node (Developed using v8.9.3)
* mplayer
* sqlite3

## Installation
* `$ git clone https://github.com/jonathonball/canticle.git`
* `$ cd canticle`
* `$ npm install`

## Usage
Though there is some mouse support, Canticle is primarily controlled by text commands.

### Commands
* `add playlist [name]` - add a new playlist to the playlist manager
* `add track [URL]` - add a new track to the open playlist
* `add tracks [playlist url]` - add tracks from a public YouTube playlist to the open playlist
* `play` - Opens a playlist, if a playist is open, play the highlighted track
  * `play [integer]`
  * `play track [integer]` - Opens a specific track in the playlist by index
  * `play [name]`
  * `play playlist [name]` - Opens a specific track in the playlist manager by name
* `shuffle` - Toggles track shuffling
* `next` - Highlight the next track to be played
* `dj` - Opens a playlist, enables shuffle, selects the next track, and starts playback
* `validate playlist [name]` validate each track in a playlist
* `pause` - Toggle pausing playback
* `quit` - Quit the application

### Keyboard shortcuts
* `Esc` - Blur the command console (click in text area to reselect)
* `Ctrl+c` - When command console is blurred exit the app
* `home` - Select first track in the open playlist
* `end` - Select the last track in the open playlist
* `PgUp` - Move playlist selection up the number of visible tracks
* `PgDn` - Move playlist selection down the number of visible tracks
* `Right Arrow` - Seek ahead in track
* `Left Arrow` - Seek behind in track
* `Up Arrow` - Go back in command history
* `Down Arrow` - Go forward in command history or blank console

## Inspiration
Inspired by [mps-youtube](https://github.com/mps-youtube/mps-youtube)

## License
* MIT

