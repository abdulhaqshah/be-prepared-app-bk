## How to run mongoDB on your device

### `Download MongoDB`

Download MongoDB from their site.

### `Install`

Launch the installer.<br>

### `Rename the folder`

After the installation rename the folder as mongo.

### `Folder Directory`

Change the folder directory by moving it to home directory (prefered) or to any directory you like

### `New Folder`

Make a new folder named 'mongo-data' in the same directory as mongo folder. This folder will contain the data of mongoDB.

### `Move to the Directory`

Move to the directory where mongo and mongo-data folder is placed in terminal.<br>
cd ~ if directory is home else cd <Directory-name>

### `Move to further directory`

Then move to the mongo/bin directory in terminal.<br>
Command : cd mongo/bin

### `Command to run MongoDB server`

Then run this command to run the mongodb server ./mongod --dbpath ~/mongo-data

## How to run the Project

To run the project just run this command in your command line nodemon server/app.js
