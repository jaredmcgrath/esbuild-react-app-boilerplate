#! /bin/sh

# Provides substitution of environment variables @ server launch time

REACT_APP_STATIC_VARIABLE_OBJECT=$(jq -n '[ env | to_entries[] | select(.key|startswith("REACT_APP_")) | .key |= ltrimstr("REACT_APP_") ] | from_entries')

echo "REACT_APP_STATIC_VARIABLE_OBJECT=$REACT_APP_STATIC_VARIABLE_OBJECT"

export REACT_APP_STATIC_VARIABLE_OBJECT

cat dist/index.html.template | envsubst > dist/index.html

# Command to run when launching the server
exec npx serve -l 6969 dist

