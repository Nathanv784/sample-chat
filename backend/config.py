import os

# Azure Web PubSub Configuration
WEBPUBSUB_CONNECTION_STRING = os.getenv("WEBPUBSUB_CONNECTION_STRING", "your-azure-webpubsub-connection-string")
HUB_NAME = os.getenv("HUB_NAME", "your-hub-name")
chub_name = "medtrain"