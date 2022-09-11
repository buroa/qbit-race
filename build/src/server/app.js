// The server for serving prometheus metrics
import fastify from 'fastify';
import { getLogger } from '../helpers/logger.js';
import { makeMetrics, stateMetrics } from '../helpers/preparePromMetrics.js';
import { getTransferInfo } from '../qbittorrent/api.js';
import { loadConfig, makeConfigIfNotExist } from '../utils/configV2.js';
const server = fastify();
const logger = getLogger(`prom-exporter`);
makeConfigIfNotExist();
const config = loadConfig();
let api;
try {
    // api = await loginV2(config.QBITTORRENT_SETTINGS);
}
catch (e) {
    logger.error(`Failed to login: ${e}`);
    process.exit;
}
// For this application, set the API log to prom-exporter
server.get('/metrics', async (request, reply) => {
    // TOOD: LoginV2 with api returned...
    // await login();
    const transferInfo = await getTransferInfo();
    // const torrents = await getTorrents();
    let finalMetrics = '';
    finalMetrics += makeMetrics(transferInfo);
    // finalMetrics += stateMetrics(torrents);
    finalMetrics += stateMetrics([]);
    reply.status(200).headers({
        'Content-Type': 'text/plain'
    }).send(finalMetrics);
});
// TODO: Get from config
const PROM_PORT = 3000;
const PROM_IP = '127.0.0.1';
server.listen(PROM_PORT, PROM_IP, (err, address) => {
    if (err) {
        logger.error(`Failed to bind to ${PROM_IP}:${PROM_PORT}. Exiting...`);
        process.exit(1);
    }
    logger.info(`Server started at ${PROM_IP}:${PROM_PORT}`);
});
//# sourceMappingURL=app.js.map