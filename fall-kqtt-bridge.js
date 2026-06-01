/**
 * fall-kqtt-bridge · v1.0
 * Bridges BroadcastChannel('fall-signal') ↔ GS.KQTT
 * by Simon Gant · sjgant80 · prime 401 · ◊·κ=φ⁴
 *
 * Usage in GoldenShower (after `network.init(code)`):
 *   GS.FallKQTTBridge.attach(network.kqtt, code);
 *
 * Standalone test (any HTML page):
 *   const bridge = new FallKQTTBridge(kqttInstance, 'TEST');
 */
class FallKQTTBridge {
  constructor(kqtt, code, opts) {
    opts = opts || {};
    this.kqtt = kqtt;
    this.code = code;
    this.relayEstateToGame = opts.relayEstateToGame !== false;
    this.relayGameToEstate = opts.relayGameToEstate !== false;
    this.topicPrefix = 'gs/' + code + '/fall';
    this.bc = new BroadcastChannel('fall-signal');
    this.stats = { estate_to_game: 0, game_to_estate: 0, started_at: Date.now() };

    if (this.relayEstateToGame) {
      this.bc.onmessage = (e) => {
        try {
          const ev = e.data;
          if (!ev || ev.source === 'goldenshower') return; // don't echo our own
          const src = String(ev.source || 'unknown').replace(/[^a-z0-9_-]/gi, '_');
          const kind = String(ev.kind || ev.type || 'event').replace(/[^a-z0-9_-]/gi, '_');
          const topic = this.topicPrefix + '/' + src + '/' + kind;
          this.kqtt.publish(topic, {
            source: ev.source,
            kind: ev.kind || ev.type,
            payload: ev.payload || ev,
            ts: ev.ts || new Date().toISOString(),
            bridge: 'fall-kqtt-bridge/1.0',
          });
          this.stats.estate_to_game++;
        } catch (err) { console.warn('[fall-kqtt-bridge] estate→game err', err); }
      };
    }

    if (this.relayGameToEstate) {
      this.kqtt.subscribe(this.topicPrefix + '/#', (msg) => {
        try {
          const topic = msg.topic || '';
          const leaf = topic.split('/').slice(3).join('/');
          this.bc.postMessage({
            type: 'fall_signal',
            source: 'goldenshower',
            kind: leaf || 'event',
            payload: msg.payload || msg,
            gs_code: this.code,
            ts: new Date().toISOString(),
          });
          this.stats.game_to_estate++;
        } catch (err) { console.warn('[fall-kqtt-bridge] game→estate err', err); }
      });
    }

    console.log('[fall-kqtt-bridge] attached · code=' + code + ' · prefix=' + this.topicPrefix);
  }

  detach() {
    try { this.bc.close(); } catch (_) {}
    console.log('[fall-kqtt-bridge] detached');
  }

  static attach(kqtt, code, opts) {
    return new FallKQTTBridge(kqtt, code, opts);
  }
}

if (typeof GS !== 'undefined') GS.FallKQTTBridge = FallKQTTBridge;
if (typeof window !== 'undefined') window.FallKQTTBridge = FallKQTTBridge;
if (typeof module !== 'undefined') module.exports = FallKQTTBridge;
