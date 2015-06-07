#!/bin/sh

# set these to the appropriate values for your server
USER=user_name
HOST=host_name
DIR=destination_directory_on_host

# copies assets/ and dist/ to destination, deleting old files on destination
rsync -vrzh --delete {assets,dist}/ $USER@$HOST:$DIR
