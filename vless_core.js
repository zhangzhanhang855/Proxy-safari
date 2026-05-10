// 节点配置信息 (由你的 URL 解析而来)
const VLESS_CONFIG = {
    uuid: '68081c3e-77c2-4d22-81d5-cccedb7ca37b',
    address: '173.245.59.218',
    port: 2087,
    path: '/',
    host: '666jrmusic.ccwu.cc'
};

async function launchProxy() {
    const log = document.getElementById('console');
    const target = document.getElementById('target_url').value;
    
    log.innerText = "正在连接至 CF 优选边缘节点...";
    
    // 建立 WSS 连接
    const wssUrl = `wss://${VLESS_CONFIG.host}:${VLESS_CONFIG.port}${VLESS_CONFIG.path}`;
    const ws = new WebSocket(wssUrl);

    ws.onopen = () => {
        log.innerText = "隧道已建立！正在进行 VLESS 握手...";
        // 构造 VLESS 头部数据 (协议版本 0)
        const vlessHeader = new Uint8Array([
            0, // version
            ...uuidToBytes(VLESS_CONFIG.uuid),
            0, // addons length
            1, // command (Connect)
            ...portToBytes(443), // 目标端口
            1, // 地址类型 (IPv4)
            ...addressToBytes(VLESS_CONFIG.address)
        ]);
        ws.send(vlessHeader);
        log.innerText = `正在访问: ${target}`;
        
        // 注意：由于浏览器安全限制，iframe 无法直接通过 WS 展示加密流量
        // 此处通常需要配合一个本地或云端的 Worker 来解密渲染
        document.getElementById('proxy_frame').src = target; 
    };

    ws.onerror = (e) => {
        log.innerText = "错误：连接失败。请检查是否开启了 CORS 限制或节点失效。";
    };
}

// 辅助函数：将 UUID 转换为字节数组
function uuidToBytes(uuid) {
    return uuid.replace(/-/g, "").match(/.{2}/g).map(byte => parseInt(byte, 16));
}

function portToBytes(port) {
    return [(port >> 8) & 0xff, port & 0xff];
}

function addressToBytes(addr) {
    return addr.split('.').map(b => parseInt(b));
}
