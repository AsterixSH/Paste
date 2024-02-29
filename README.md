# Paste Frontend
This is our frontend for paste.asterix.sh, this is hosted on [Firebase Hosting](https://firebase.google.com/).

## Local Development (configure FireStore)
Replace [bun](https://bun.sh) with your prefered JavaScript runtime. (NPM)
```console
# Install Depends
$ bun install

# Run The Web Server
$ bun run dev
```

## Prodution Deployment
Replace [bun](https://bun.sh) with your prefered JavaScript runtime. (NPM)
```console
# Install Firebase Globally
$ bun install -g firebase-tools

# Login to Firebase
$ firebase login

# Deploy to Firebase Hosting
$ firebase deploy
```