from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS
from azure.messaging.webpubsubservice import WebPubSubServiceClient

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Initialize SocketIO with Flask app
# Initialize SocketIO with Flask app
socketio = SocketIO(app, cors_allowed_origins="*")

# Azure Web PubSub configuration
CONNECTION_STRING = "Endpoint=https://medtrainchatbot.webpubsub.azure.com;AccessKey=7mzrRB65gPrxhVq0q/Udq2Rz3LxVI+ZETXy8DxZXDBM=;Version=1.0;"
HUB_NAME = "chat"  # Replace with your hub name

# Create a Web PubSub client
client = WebPubSubServiceClient.from_connection_string(CONNECTION_STRING, HUB_NAME)


@app.route('/negotiate', methods=['GET'])
def negotiate():
    """
    Endpoint to generate a client access token for connecting to Azure Web PubSub.
    """
    try:
        print("Attempting to generate token...")

        # Generate a token with roles
        token_response = client.get_client_access_token(
            expires_in=60 * 60,  # Token validity: 1 hour
            roles=["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"]  # Add necessary roles
        )

        print("Token response received:", token_response)
        token_url = token_response["url"] # Access token URL directly
        print("Token URL:", token_url)
        return jsonify({"url": token_url})
    except Exception as e:
        print(f"Error generating token: {e}")
        return jsonify({"error": str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)

@socketio.on('message')
def handle_message(data):
    print('Message received from client:', data)
    socketio.emit('message', data)  # Broadcast message to all clients

if __name__ == '__main__':
    print("Starting Flask backend...")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)