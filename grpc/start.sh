#!/bin/bash
npm run start 4 8080

gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8080; $SHELL'"
gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8081; $SHELL'"
gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8082; $SHELL'"
gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8083; $SHELL'"

# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8180 8080; $SHELL'"
# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8181 8081; $SHELL'"
# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8182 8082; $SHELL'"
# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8183 8083; $SHELL'"

# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8280 8080; $SHELL'"
# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8281 8081; $SHELL'"
# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8282 8082; $SHELL'"
# gnome-terminal --tab --title="test" --command="bash -c 'cd $PWD; npm run start-server 8283 8083; $SHELL'"