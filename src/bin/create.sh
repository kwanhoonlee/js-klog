#!/bin/bash

if [ ! -d ~/.k-log ];
then mkdir -p ~/.k-log/datastore/meta ~/.k-log/datastore/job ~/.k-log/datastore/eventlog
mkdir -p ~/.k-log/js-ipfs
touch ~/.k-log/config;
fi;
