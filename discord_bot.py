import discord
import requests

import os
TOKEN = os.environ.get("DISCORD_TOKEN")

intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"Bot conectado como {client.user}")

@client.event
async def on_message(message):
    if message.author == client.user:
        return
    try:
        response = requests.post(API_URL, json={"text": message.content, "canal": "discord"})
        data = response.json()
        await message.channel.send(data["mensaje"])
    except Exception as e:
        print(f"Error: {e}")

client.run(TOKEN)