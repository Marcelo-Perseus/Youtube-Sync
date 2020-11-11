import socket # For networking
import threading # For setting up multithreaded client handling
import queue # For communicating between threads
import time # For waiting
import random # For id generation
import string # For id generation

# A list for sessions
sessions = dict()

def session_thread(id, host, queue):
    # Create a list of users
    users = [host]

    # Infinite runtime loop
    while 1:
        # If everybody disconnected
        if len(users) == 0:
            break

        # If there are any users to add to the session, add them
        if not queue.empty():
            users += [queue.get()]

        # Loop through each user and receive data
        i = 0
        while i < len(users):
            user = users[i]

            # Default no message if there is nothing to receive
            message = ""
            try:
                message = user.recv(2048).decode("utf-8")
            except Exception as e: # Timeout occurred
                pass

            # Forwards the message to every client in the session
            if message == "CLOSE":
                # If the user wants to close, then close the connection
                user.close()
                users = users[:i] + users[i+1:]
                i -= 1
            elif message != "":
                for user in users:
                    user.send(message.encode("utf-8"))

            i += 1

    print("Session closed with id:", id)

    # Pop the session from the sessions dictionary
    sessions.pop(id, None)

    return

def generate_id(l):
    return ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits) for _ in range(l))

def create_session(host):
    # Generate a random session id
    session_id = generate_id(20)

    # Create a join queue for the session
    join_queue = queue.Queue()

    # Add the queue to the global dict
    sessions[session_id] = join_queue

    print("Created session with id:", session_id)

    # Send the session id to the host
    host.send(("ID:"+session_id).encode("utf-8"))

    # Spawn a session thread
    t = threading.Thread(target=session_thread, args=[session_id, host, join_queue])

    # Execute the thread
    t.start()

def join_session(client):
    # Get the session id from the client
    session_id = client.recv(2048).decode("utf-8")

    # Validate that the id is valid
    if session_id not in sessions:
        client.close()

    try:
        sessions[session_id].put(client)
    except Exception as e: # In case a client tries to connect as the session closes
        print("Client failed to connect")
        print(e)
        client.close()

# Make the socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind it locally
serversocket.bind(("", 30493))

# Listen for connections
serversocket.listen(5)

print("Listening for connections")

# Runtime loop
while True:
    # Accept connections
    (clientsocket, address) = serversocket.accept()

    # Notify that a connection has been received
    print("Connected to:", str(address[0])+":"+str(address[1]))

    # Receive command from client
    message = clientsocket.recv(2048).decode("utf-8")

    # Make it a non blocking client socket with a timeout of 0.1 seconds
    clientsocket.settimeout(0.8)

    # If the message is a valid command, then execute, otherwise close
    if message == "CREATE":
        create_session(clientsocket)
    elif message == "JOIN":
        join_session(clientsocket)
    else:
        clientsocket.close()
