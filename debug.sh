#!/bin/bash

node .;
if [ $? -ne 0 ]; then
    pkill mplayer;
fi;
