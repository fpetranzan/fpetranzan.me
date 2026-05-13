---
name: Offerte Radar Bot
year: '2026'
order: 9
tecnologies:
  - Python
  - Telethon
  - python-telegram-bot
  - Gemma 4 27b
  - SQLite
  - Docker
liveUrl: 'https://t.me/OfferteRadar_Bot'
---
<p>Il progetto OfferteRadarBot è un bot Telegram intelligente che monitora automaticamente molteplici canali Telegram dedicati alle offerte di prodotti, trasformando informazioni caotiche in notifiche personalizzate per gli utenti. </p>
<p>Gli utenti possono configurare filtri personalizzati chiamati "osservatori" basati su nome prodotto, marca, fascia di prezzo e caratteristiche specifiche, ricevendo alert istantanei quando vengono individuate offerte corrispondenti.</p> 
<p>Il bot supporta il monitoraggio in tempo reale di canali configurati, l'estrazione intelligente dei dati delle offerte tramite intelligenza artificiale (Google Generative AI), e la deduplicazione per evitare notifiche duplicate. </p>
<p>L'architettura si basa su Python come linguaggio principale, utilizzando Telethon per il monitoraggio dei canali come userbot e python-telegram-bot per l'interazione con gli utenti. </p>
<p>SQLite gestisce la persistenza dei dati degli utenti e delle configurazioni, mentre Docker e Docker Compose facilitano il deployment containerizzato. </p>
<p>L'AI estrae dati strutturati dai messaggi non strutturati, validandoli con Pydantic per garantire accuratezza.</p>
<p>Nato dall'esigenza di semplificare la ricerca di offerte, il progetto si propone come strumento accessibile per chiunque voglia rimanere aggiornato sulle migliori occasioni senza dover monitorare manualmente numerosi canali Telegram.</p>