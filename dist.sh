# remove old zip
rm -f tcp-chat.zip

# clear out node modules
rm -rf node_modules

# re-install production dependencies
npm i --production

if [ ! -f 'node.exe' ]; then
  wget https://nodejs.org/dist/v4.4.7/win-x64/node.exe
fi

# zip everything up
zip -r tcp-chat.zip lib node_modules config.yml index.js server.bat node.exe
