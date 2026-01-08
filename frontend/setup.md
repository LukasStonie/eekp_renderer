# Initial Setup
## Initialize Project
When first starting the container, the project has to be initialized. For this, navigate to the directory `/var/www/html/app` and run the following command to create the project

```bash
npm create nuxt eekp_renderer -- --template minimal --packageManager npm --gitInit false
```

The command autmatically creates a Vue app using TypeScript and names the project `eekp_renderer`. However, the dialouge might still ask to use rolldown-vite, this option should be answered with `no`. To conclude the installation, select `yes` when asked if you want to install with npm and start now.

Once the installation is done, and the server is fully started up, you can quit the server (CMD+C).

## Install required packages
When installing packages, make sure to be in the directory of the vite project, i.e., `/var/www/html/app/eekp_renderer`. 
```bash
npm install pinia
```

## Necesarry Changes
### Define Port
To make the app visibile outside of the container, two settings have to be changed.

Firstly, open the file `/var/www/html/app/eekp_renderer/vite.config.js` and add the server object which defines the port to use as follows

```TypeScript
export default defineConfig({
  server: {    // <-- this object is added
    port: 8000
  },
  plugins: [vue()]
})
```

Port 8000 is used, because it is defined in the `docker-compose.yml` file that this container relies on. Feel free to use any other port.

### Expose Running App
Secondly, we need to expose the host. For this, open the file `/var/www/html/app/eekp_renderer/package.json` and add the host flag to the dev script

```json
"scripts": {
    "dev": "vite --host",
    ...
}
```

## Running the App
Once the configurations are made, the application can be started by navigating into the `/var/www/html/app/eekp_renderer` directory. To server is started by running the following command

```bash
npm run dev
```

The application can now be reached at [http://localhost:8000/](http://localhost:8000/) in your browser.