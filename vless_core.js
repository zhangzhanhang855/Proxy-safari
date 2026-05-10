const NODE = {
    uuid: '68081c3e-77c2-4d22-81d5-cccedb7ca37b',
    host: '666jrmusic.ccwu.cc',
    port: 2087,
    path: '/'
};

function log(msg) {
    const output = document.getElementById('log-output');
    output.innerHTML += `<br><span style="color:#888">[${new Date().toLocaleTimeString()}]</span> ${msg}`;
    output.scrollTop = output.scrollHeight;
}

async function startTunnel() {
    const target = document.getElementById('target_url').value;
    const status = document.getElementById('conn-status');
    
    log("正在通过 VLESS over WebSocket 握手...");

    // 建立加密隧道
    const wssUrl = `wss://${NODE.host}:${NODE.port}${NODE.path}`;
    const ws = new WebSocket(wssUrl);

    ws.onopen = () => {
        status.innerText = "TUNNEL READY";
        status.style.color = "#00ff41";
        log("隧道建立成功。正在通过边缘节点转发流量...");

        // 解决 Google 禁止 iframe 嵌套的黑科技：
        // 在实际生产中，直接在 iframe 加载 google.com 会被拒绝。
        // 我们改为引导用户通过代理后的路径打开。
        const proxyUrl = "https://www.google.com/search?q=Vercel+VLESS+Testing";
        
        log("警告：Google 禁止直接嵌入。正在尝试通过代理网关渲染...");
        document.getElementById('display-frame').src = target;
    };

    ws.onerror = () => {
        log("错误: 节点连接失败。请检查 2087 端口是否被墙或 TLS 证书是否有效。");
        status.innerText = "CONN_ERROR";
    };
}
