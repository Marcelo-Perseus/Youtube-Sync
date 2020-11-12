# Youtube Sync
 An ElectronJS program that will allow users to sync up youtube videos with friends in a session.

## Server
 There is a server.py file located in the server folder that will open a server on port 30493. I believe these require port forwarding to allow access. There is also a settings.json file in the main project folder where the the user should specify the server host's public IP address.
 
## Application
 This application is a desktop application written on the ElectronJS framework that allows multiple users to create private watch sessions and join created sessions to sync up YouTube videos with anybody in the session. To make a session, click the create session button. This will connect to a server running on the IP address provided in the settings.json file. When a session is created, there will be a session ID that can be shared with other users. To join an already created session, click the join session button on the main screen and input the session ID provided. Once a user is in the player screen, they can provide the ID of the youtube video and click Queue to load the video for everybody in the session. Any playing and pausing in the video will be done to all connected users.

### Splash Screen
![Index Page](https://github.com/Marcelo-Perseus/Youtube-Sync/blob/main/screenshots/Index.png?raw=true)

### Unstarted Player
![Unstarted Player](https://github.com/Marcelo-Perseus/Youtube-Sync/blob/main/screenshots/Unstarted%20Player.png?raw=true)

### Started Player
![Started Player](https://github.com/Marcelo-Perseus/Youtube-Sync/blob/main/screenshots/Started%20Player.png?raw=true)
