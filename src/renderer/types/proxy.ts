export type Proxy = {
    name: string;
    ip: string;
    port: string;
    user: string;
    pass: string;
    status: number;
};

export type ProxyList = {
    name: string;
    proxies: Proxy[];
};
