#!/bin/bash

$path = nlines=$(wc -l < $1)
$parentHost = nlines=$(wc -l < $2)
$parentPort = nlines=$(wc -l < $3)

echo \#AUTOMATICALLY GENERATED LOBBY CONFIG\n parentHost: $parentHost\n parentPort: $parentPort >> lobby.conf
apt update
apt install nodejs npm wget -y
wget $path
npm run $path