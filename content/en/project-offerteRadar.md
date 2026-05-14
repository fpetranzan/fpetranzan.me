---
name: Offerte Radar Bot
year: '2026'
order: 9
technologies:
  - Python
  - Telethon
  - python-telegram-bot
  - Gemma 4 27b
  - SQLite
  - Docker
liveUrl: 'https://t.me/OfferteRadar_Bot'
---
<p>The OfferteRadarBot project is an intelligent Telegram bot that automatically monitors multiple Telegram channels dedicated to product deals, transforming chaotic information into personalized notifications for users.</p>
<p>Users can configure custom filters called "watchers" based on product name, brand, price range, and specific features, receiving instant alerts whenever matching deals are detected.</p>
<p>The bot supports real-time monitoring of configured channels, intelligent deal data extraction through artificial intelligence (Google Generative AI), and deduplication to prevent duplicate notifications.</p>
<p>The architecture is based on Python as the main programming language, using Telethon for channel monitoring as a userbot and python-telegram-bot for user interaction.</p>
<p>SQLite handles the persistence of user data and configurations, while Docker and Docker Compose simplify containerized deployment. </p>
<p>The AI extracts structured data from unstructured messages, validating it with Pydantic to ensure accuracy.</p>
<p>Born from the need to simplify deal searching, the project aims to provide an accessible tool for anyone who wants to stay updated on the best opportunities without manually monitoring numerous Telegram channels.</p>