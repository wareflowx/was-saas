import t from "electron";
function a(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var e = {}, o;
function l() {
  if (o) return e;
  o = 1;
  const { contextBridge: r } = t;
  return r.exposeInMainWorld("electronAPI", {
    // Tu peux ajouter des APIs ici plus tard
    platform: process.platform
  }), e;
}
var n = l();
const u = /* @__PURE__ */ a(n);
export {
  u as default
};
