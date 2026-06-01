# fall-kqtt-bridge

**The 50-LOC bridge between Simon's `fall-signal` mesh and Thomas's `GS.KQTT`.**

Companion to [teslasolar/GoldenShower](https://github.com/teslasolar/GoldenShower) · PR [#5](https://github.com/teslasolar/GoldenShower/pull/5).

## ▶ Live demo

**[https://sjgant80-hub.github.io/fall-kqtt-bridge/](https://sjgant80-hub.github.io/fall-kqtt-bridge/)**

Open it. Fire events in either panel. Watch the bridge relay them. Open in a second tab to see real cross-tab `BroadcastChannel` flow.

## What it does

```
fall-signal (BroadcastChannel)  ◄─ bridge ─►  GS.KQTT (gs/<code>/fall/#)
```

- Estate event → `gs/<code>/fall/<source>/<kind>` (KQTT publish)
- Game event → `fall-signal` payload `{ source:'goldenshower', kind:<leaf>, payload, gs_code }`
- Loop-safe (filters its own `goldenshower`-sourced echoes)
- Opt-in toggles (`relayEstateToGame`, `relayGameToEstate`)
- Zero new transport · uses the existing KQTT instance + BroadcastChannel

## One-line integration in GoldenShower

In `docs/golden-shower/multiplayer/lobby.md` after `network.init(code)`:

```javascript
if (typeof GS.FallKQTTBridge !== 'undefined') {
  GS.fallBridge = GS.FallKQTTBridge.attach(network.kqtt, code);
}
```

## Konomi mint receipt

- cert-a943da938434
- sha256: `a943da938434a14cd4b99c134451ff78a99f3ed3556d44d5b62340dd7846d4f8`
- Parents: cert-v20.1-seed, cert-substrate-doc

## License

MIT · prime 401 · ◊·κ=φ⁴
