# ONT-DART Frontend

## Building for Deployment

### Step 1: Install Dependencies
```
npm install
```

### Step 2: Compile 
```
npm run build
```

## Building for Development

### Step 1: Run in development server
```
npm run serve
```

### Optional: Lint and fix files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/). This project uses Vue CLI 2.0.

## Notes

- In order for the ONT-DART website to work properly, it's important that the website is deployed on the same machine as the backend shell scripts. This is because the file paths provided to the web page are passed directly to the shell scripts for further processing.