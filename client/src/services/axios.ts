import axios from "axios";
import { setupCache } from "axios-cache-adapter";

const cache = setupCache({
    maxAge: 0,//15 * 60 * 1000,
});

const api = axios.create({
    baseURL: "/api",
    timeout: 30000,
    adapter: cache.adapter,
    cache: {
        invalidate: async (config, request) => {
            console.log('config, request :>> ', config, request);
            // if (request.clearCacheEntry) {
            //     await config.store.removeItem(config.uuid);
            // }
        },
    },
});

api.interceptors.request.use(
    (config) => {
        if (!config.headers.authorization) {
            config.headers.authorization =
                window.localStorage.getItem("token") || "";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
