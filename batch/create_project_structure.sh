#!/bin/sh

CURRENT_DIR=$(dirname $0)
TARGET_DIR=$1
FETCH_LATEST_TGZ=$2
CURRENT_DATE=`eval date +%Y%m%d`

echo $TARGET_DIR
echo $FETCH_LATEST_TGZ