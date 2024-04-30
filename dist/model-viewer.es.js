import { EventDispatcher as Fe, Vector3 as I, MOUSE as F, TOUCH as D, Quaternion as fe, Spherical as ge, Vector2 as O, MathUtils as _, BufferGeometry as Te, Group as H, BufferAttribute as G, Mesh as Ae, NearestFilter as ye, MeshLambertMaterial as De, DoubleSide as we, LineBasicMaterial as He, BoxGeometry as Ge, EdgesGeometry as Xe, LineSegments as Be, TextureLoader as Ze, WebGLRenderer as Ke, PerspectiveCamera as Ve, Scene as qe, AmbientLight as Ce, Color as We, AxesHelper as $e, GridHelper as Qe, BoxHelper as Je, Box3 as et, Sphere as tt } from "three";
import { Molang as ot } from "molang";
import it from "wintersky";
const be = { type: "change" }, $ = { type: "start" }, Ee = { type: "end" };
class nt extends Fe {
  constructor(o, i) {
    super(), this.object = o, this.domElement = i, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new I(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: F.ROTATE, MIDDLE: F.DOLLY, RIGHT: F.PAN }, this.touches = { ONE: D.ROTATE, TWO: D.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return r.phi;
    }, this.getAzimuthalAngle = function() {
      return r.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(t) {
      t.addEventListener("keydown", he), this._domElementKeyEvents = t;
    }, this.saveState = function() {
      e.target0.copy(e.target), e.position0.copy(e.object.position), e.zoom0 = e.object.zoom;
    }, this.reset = function() {
      e.target.copy(e.target0), e.object.position.copy(e.position0), e.object.zoom = e.zoom0, e.object.updateProjectionMatrix(), e.dispatchEvent(be), e.update(), s = n.NONE;
    }, this.update = function() {
      const t = new I(), a = new fe().setFromUnitVectors(o.up, new I(0, 1, 0)), E = a.clone().invert(), T = new I(), v = new fe(), U = 2 * Math.PI;
      return function() {
        const me = e.object.position;
        t.copy(me).sub(e.target), t.applyQuaternion(a), r.setFromVector3(t), e.autoRotate && s === n.NONE && M(j()), e.enableDamping ? (r.theta += h.theta * e.dampingFactor, r.phi += h.phi * e.dampingFactor) : (r.theta += h.theta, r.phi += h.phi);
        let L = e.minAzimuthAngle, N = e.maxAzimuthAngle;
        return isFinite(L) && isFinite(N) && (L < -Math.PI ? L += U : L > Math.PI && (L -= U), N < -Math.PI ? N += U : N > Math.PI && (N -= U), L <= N ? r.theta = Math.max(L, Math.min(N, r.theta)) : r.theta = r.theta > (L + N) / 2 ? Math.max(L, r.theta) : Math.min(N, r.theta)), r.phi = Math.max(e.minPolarAngle, Math.min(e.maxPolarAngle, r.phi)), r.makeSafe(), r.radius *= l, r.radius = Math.max(e.minDistance, Math.min(e.maxDistance, r.radius)), e.enableDamping === !0 ? e.target.addScaledVector(g, e.dampingFactor) : e.target.add(g), t.setFromSpherical(r), t.applyQuaternion(E), me.copy(e.target).add(t), e.object.lookAt(e.target), e.enableDamping === !0 ? (h.theta *= 1 - e.dampingFactor, h.phi *= 1 - e.dampingFactor, g.multiplyScalar(1 - e.dampingFactor)) : (h.set(0, 0, 0), g.set(0, 0, 0)), l = 1, c || T.distanceToSquared(e.object.position) > f || 8 * (1 - v.dot(e.object.quaternion)) > f ? (e.dispatchEvent(be), T.copy(e.object.position), v.copy(e.object.quaternion), c = !1, !0) : !1;
      };
    }(), this.dispose = function() {
      e.domElement.removeEventListener("contextmenu", ue), e.domElement.removeEventListener("pointerdown", ae), e.domElement.removeEventListener("pointercancel", ce), e.domElement.removeEventListener("wheel", le), e.domElement.removeEventListener("pointermove", q), e.domElement.removeEventListener("pointerup", C), e._domElementKeyEvents !== null && e._domElementKeyEvents.removeEventListener("keydown", he);
    };
    const e = this, n = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let s = n.NONE;
    const f = 1e-6, r = new ge(), h = new ge();
    let l = 1;
    const g = new I();
    let c = !1;
    const p = new O(), y = new O(), b = new O(), A = new O(), d = new O(), w = new O(), m = new O(), P = new O(), R = new O(), u = [], Y = {};
    function j() {
      return 2 * Math.PI / 60 / 60 * e.autoRotateSpeed;
    }
    function x() {
      return Math.pow(0.95, e.zoomSpeed);
    }
    function M(t) {
      h.theta -= t;
    }
    function z(t) {
      h.phi -= t;
    }
    const X = function() {
      const t = new I();
      return function(E, T) {
        t.setFromMatrixColumn(T, 0), t.multiplyScalar(-E), g.add(t);
      };
    }(), B = function() {
      const t = new I();
      return function(E, T) {
        e.screenSpacePanning === !0 ? t.setFromMatrixColumn(T, 1) : (t.setFromMatrixColumn(T, 0), t.crossVectors(e.object.up, t)), t.multiplyScalar(E), g.add(t);
      };
    }(), k = function() {
      const t = new I();
      return function(E, T) {
        const v = e.domElement;
        if (e.object.isPerspectiveCamera) {
          const U = e.object.position;
          t.copy(U).sub(e.target);
          let Z = t.length();
          Z *= Math.tan(e.object.fov / 2 * Math.PI / 180), X(2 * E * Z / v.clientHeight, e.object.matrix), B(2 * T * Z / v.clientHeight, e.object.matrix);
        } else
          e.object.isOrthographicCamera ? (X(E * (e.object.right - e.object.left) / e.object.zoom / v.clientWidth, e.object.matrix), B(T * (e.object.top - e.object.bottom) / e.object.zoom / v.clientHeight, e.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), e.enablePan = !1);
      };
    }();
    function V(t) {
      e.object.isPerspectiveCamera ? l /= t : e.object.isOrthographicCamera ? (e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom * t)), e.object.updateProjectionMatrix(), c = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
    }
    function Q(t) {
      e.object.isPerspectiveCamera ? l *= t : e.object.isOrthographicCamera ? (e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom / t)), e.object.updateProjectionMatrix(), c = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
    }
    function J(t) {
      p.set(t.clientX, t.clientY);
    }
    function Pe(t) {
      m.set(t.clientX, t.clientY);
    }
    function ee(t) {
      A.set(t.clientX, t.clientY);
    }
    function xe(t) {
      y.set(t.clientX, t.clientY), b.subVectors(y, p).multiplyScalar(e.rotateSpeed);
      const a = e.domElement;
      M(2 * Math.PI * b.x / a.clientHeight), z(2 * Math.PI * b.y / a.clientHeight), p.copy(y), e.update();
    }
    function ke(t) {
      P.set(t.clientX, t.clientY), R.subVectors(P, m), R.y > 0 ? V(x()) : R.y < 0 && Q(x()), m.copy(P), e.update();
    }
    function ve(t) {
      d.set(t.clientX, t.clientY), w.subVectors(d, A).multiplyScalar(e.panSpeed), k(w.x, w.y), A.copy(d), e.update();
    }
    function Re(t) {
      t.deltaY < 0 ? Q(x()) : t.deltaY > 0 && V(x()), e.update();
    }
    function Oe(t) {
      let a = !1;
      switch (t.code) {
        case e.keys.UP:
          t.ctrlKey || t.metaKey || t.shiftKey ? z(2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : k(0, e.keyPanSpeed), a = !0;
          break;
        case e.keys.BOTTOM:
          t.ctrlKey || t.metaKey || t.shiftKey ? z(-2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : k(0, -e.keyPanSpeed), a = !0;
          break;
        case e.keys.LEFT:
          t.ctrlKey || t.metaKey || t.shiftKey ? M(2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : k(e.keyPanSpeed, 0), a = !0;
          break;
        case e.keys.RIGHT:
          t.ctrlKey || t.metaKey || t.shiftKey ? M(-2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : k(-e.keyPanSpeed, 0), a = !0;
          break;
      }
      a && (t.preventDefault(), e.update());
    }
    function te() {
      if (u.length === 1)
        p.set(u[0].pageX, u[0].pageY);
      else {
        const t = 0.5 * (u[0].pageX + u[1].pageX), a = 0.5 * (u[0].pageY + u[1].pageY);
        p.set(t, a);
      }
    }
    function oe() {
      if (u.length === 1)
        A.set(u[0].pageX, u[0].pageY);
      else {
        const t = 0.5 * (u[0].pageX + u[1].pageX), a = 0.5 * (u[0].pageY + u[1].pageY);
        A.set(t, a);
      }
    }
    function ie() {
      const t = u[0].pageX - u[1].pageX, a = u[0].pageY - u[1].pageY, E = Math.sqrt(t * t + a * a);
      m.set(0, E);
    }
    function Se() {
      e.enableZoom && ie(), e.enablePan && oe();
    }
    function Le() {
      e.enableZoom && ie(), e.enableRotate && te();
    }
    function ne(t) {
      if (u.length == 1)
        y.set(t.pageX, t.pageY);
      else {
        const E = W(t), T = 0.5 * (t.pageX + E.x), v = 0.5 * (t.pageY + E.y);
        y.set(T, v);
      }
      b.subVectors(y, p).multiplyScalar(e.rotateSpeed);
      const a = e.domElement;
      M(2 * Math.PI * b.x / a.clientHeight), z(2 * Math.PI * b.y / a.clientHeight), p.copy(y);
    }
    function se(t) {
      if (u.length === 1)
        d.set(t.pageX, t.pageY);
      else {
        const a = W(t), E = 0.5 * (t.pageX + a.x), T = 0.5 * (t.pageY + a.y);
        d.set(E, T);
      }
      w.subVectors(d, A).multiplyScalar(e.panSpeed), k(w.x, w.y), A.copy(d);
    }
    function re(t) {
      const a = W(t), E = t.pageX - a.x, T = t.pageY - a.y, v = Math.sqrt(E * E + T * T);
      P.set(0, v), R.set(0, Math.pow(P.y / m.y, e.zoomSpeed)), V(R.y), m.copy(P);
    }
    function Ne(t) {
      e.enableZoom && re(t), e.enablePan && se(t);
    }
    function je(t) {
      e.enableZoom && re(t), e.enableRotate && ne(t);
    }
    function ae(t) {
      e.enabled !== !1 && (u.length === 0 && (e.domElement.setPointerCapture(t.pointerId), e.domElement.addEventListener("pointermove", q), e.domElement.addEventListener("pointerup", C)), Ue(t), t.pointerType === "touch" ? Ye(t) : Ie(t));
    }
    function q(t) {
      e.enabled !== !1 && (t.pointerType === "touch" ? ze(t) : _e(t));
    }
    function C(t) {
      de(t), u.length === 0 && (e.domElement.releasePointerCapture(t.pointerId), e.domElement.removeEventListener("pointermove", q), e.domElement.removeEventListener("pointerup", C)), e.dispatchEvent(Ee), s = n.NONE;
    }
    function ce(t) {
      de(t);
    }
    function Ie(t) {
      let a;
      switch (t.button) {
        case 0:
          a = e.mouseButtons.LEFT;
          break;
        case 1:
          a = e.mouseButtons.MIDDLE;
          break;
        case 2:
          a = e.mouseButtons.RIGHT;
          break;
        default:
          a = -1;
      }
      switch (a) {
        case F.DOLLY:
          if (e.enableZoom === !1)
            return;
          Pe(t), s = n.DOLLY;
          break;
        case F.ROTATE:
          if (t.ctrlKey || t.metaKey || t.shiftKey) {
            if (e.enablePan === !1)
              return;
            ee(t), s = n.PAN;
          } else {
            if (e.enableRotate === !1)
              return;
            J(t), s = n.ROTATE;
          }
          break;
        case F.PAN:
          if (t.ctrlKey || t.metaKey || t.shiftKey) {
            if (e.enableRotate === !1)
              return;
            J(t), s = n.ROTATE;
          } else {
            if (e.enablePan === !1)
              return;
            ee(t), s = n.PAN;
          }
          break;
        default:
          s = n.NONE;
      }
      s !== n.NONE && e.dispatchEvent($);
    }
    function _e(t) {
      switch (s) {
        case n.ROTATE:
          if (e.enableRotate === !1)
            return;
          xe(t);
          break;
        case n.DOLLY:
          if (e.enableZoom === !1)
            return;
          ke(t);
          break;
        case n.PAN:
          if (e.enablePan === !1)
            return;
          ve(t);
          break;
      }
    }
    function le(t) {
      e.enabled === !1 || e.enableZoom === !1 || s !== n.NONE || (t.preventDefault(), e.dispatchEvent($), Re(t), e.dispatchEvent(Ee));
    }
    function he(t) {
      e.enabled === !1 || e.enablePan === !1 || Oe(t);
    }
    function Ye(t) {
      switch (pe(t), u.length) {
        case 1:
          switch (e.touches.ONE) {
            case D.ROTATE:
              if (e.enableRotate === !1)
                return;
              te(), s = n.TOUCH_ROTATE;
              break;
            case D.PAN:
              if (e.enablePan === !1)
                return;
              oe(), s = n.TOUCH_PAN;
              break;
            default:
              s = n.NONE;
          }
          break;
        case 2:
          switch (e.touches.TWO) {
            case D.DOLLY_PAN:
              if (e.enableZoom === !1 && e.enablePan === !1)
                return;
              Se(), s = n.TOUCH_DOLLY_PAN;
              break;
            case D.DOLLY_ROTATE:
              if (e.enableZoom === !1 && e.enableRotate === !1)
                return;
              Le(), s = n.TOUCH_DOLLY_ROTATE;
              break;
            default:
              s = n.NONE;
          }
          break;
        default:
          s = n.NONE;
      }
      s !== n.NONE && e.dispatchEvent($);
    }
    function ze(t) {
      switch (pe(t), s) {
        case n.TOUCH_ROTATE:
          if (e.enableRotate === !1)
            return;
          ne(t), e.update();
          break;
        case n.TOUCH_PAN:
          if (e.enablePan === !1)
            return;
          se(t), e.update();
          break;
        case n.TOUCH_DOLLY_PAN:
          if (e.enableZoom === !1 && e.enablePan === !1)
            return;
          Ne(t), e.update();
          break;
        case n.TOUCH_DOLLY_ROTATE:
          if (e.enableZoom === !1 && e.enableRotate === !1)
            return;
          je(t), e.update();
          break;
        default:
          s = n.NONE;
      }
    }
    function ue(t) {
      e.enabled !== !1 && t.preventDefault();
    }
    function Ue(t) {
      u.push(t);
    }
    function de(t) {
      delete Y[t.pointerId];
      for (let a = 0; a < u.length; a++)
        if (u[a].pointerId == t.pointerId) {
          u.splice(a, 1);
          return;
        }
    }
    function pe(t) {
      let a = Y[t.pointerId];
      a === void 0 && (a = new O(), Y[t.pointerId] = a), a.set(t.pageX, t.pageY);
    }
    function W(t) {
      const a = t.pointerId === u[0].pointerId ? u[1] : u[0];
      return Y[a.pointerId];
    }
    e.domElement.addEventListener("contextmenu", ue), e.domElement.addEventListener("pointerdown", ae), e.domElement.addEventListener("pointercancel", ce), e.domElement.addEventListener("wheel", le, { passive: !1 }), this.update();
  }
}
class Me {
  constructor(o, i) {
    this.animation = o, this.currentEffectIndex = 0, this.tickingEffects = [], this.effects = Object.entries(i).map(
      ([e, n]) => [
        Number(e),
        Array.isArray(n) ? n : [n]
      ]
    ).sort(([e], [n]) => e - n);
  }
  getCurrentEffects() {
    if (this.currentEffectIndex >= this.effects.length)
      return;
    const o = this.effects[this.currentEffectIndex];
    if (!(o[0] > this.animation.roundedCurrentTime))
      return this.currentEffectIndex++, o[1];
  }
  reset() {
    this.currentEffectIndex = 0;
  }
}
class st extends Me {
  tick() {
    const o = super.getCurrentEffects() ?? [];
    o.length > 0 && console.log(
      `Playing sound effects: "${o.map((i) => i.effect).join(", ")}"`
    );
  }
}
class rt extends Me {
  constructor() {
    super(...arguments), this.disposables = [];
  }
  tick() {
    this.tickingEffects.forEach((i) => i.tick());
    const o = super.getCurrentEffects() ?? [];
    for (const { locator: i, effect: e, pre_effect_script: n } of o) {
      if (!e)
        return;
      const s = this.animation.getAnimator(), f = s.getModel(), r = s.getEmitter(e);
      if (!r || !s.winterskyScene)
        return;
      const h = i ? f.getLocator(i) : void 0, l = new it.Emitter(
        s.winterskyScene,
        r,
        {
          parent_mode: h ? "locator" : "entity",
          loop_mode: "once"
        }
      );
      h && (h.add(l.local_space), l.local_space.parent = h);
      const g = {
        tick: () => {
          l.tick(), l.enabled || (l.delete(), this.tickingEffects = this.tickingEffects.filter(
            (c) => c !== g
          ));
        }
      };
      this.tickingEffects.push(g), this.disposables.push({
        dispose: () => {
          l.delete(), this.tickingEffects = this.tickingEffects.filter(
            (c) => c !== g
          );
        }
      }), l.start(), l.tick();
    }
  }
  dispose() {
    this.disposables.forEach((o) => o.dispose()), this.disposables = [];
  }
}
class at {
  constructor(o, i) {
    this.animator = o, this.animationData = i, this.startTimestamp = 0, this.lastFrameTimestamp = 0, this.isRunning = !1, this.env = {
      "query.anim_time": () => this.currentTime,
      "query.delta_time": () => this.startTimestamp - this.lastFrameTimestamp,
      "query.life_time": () => this.currentTime
    }, this.molang = new ot(this.env, {
      convertUndefined: !0
    }), this.soundEffects = new st(
      this,
      this.animationData.sound_effects ?? {}
    ), this.particleEffects = new rt(
      this,
      this.animationData.particle_effects ?? {}
    );
  }
  getAnimator() {
    return this.animator;
  }
  execute(o) {
    return this.molang.executeAndCatch(o);
  }
  parseBoneModifier(o) {
    if (typeof o == "number")
      return [o, o, o];
    if (typeof o == "string") {
      const i = typeof o == "string" ? this.execute(o) : o;
      return [i, i, i];
    } else {
      if (Array.isArray(o))
        return o.map(
          (i) => typeof i == "string" ? this.execute(i) : i
        );
      if (o !== void 0) {
        const i = Object.entries(o).map(
          ([e, n]) => [Number(e), n]
        ).sort(([e], [n]) => e - n);
        for (let e = i.length - 1; e >= 0; e--) {
          let [n, s] = i[e];
          if (!(n > this.currentTime))
            if (n === this.currentTime) {
              if (Array.isArray(s))
                return s.map(
                  (f) => typeof f == "string" ? this.execute(f) : f
                );
              throw new Error("Format not supported yet");
            } else {
              let [f, r] = i[_.euclideanModulo(e + 1, i.length)], h = f - n;
              if (Array.isArray(s) && Array.isArray(r))
                return s = s.map(
                  (l) => typeof l == "string" ? this.execute(l) : l
                ), r = r.map(
                  (l) => typeof l == "string" ? this.execute(l) : l
                ), s.map(
                  (l, g) => l + (r[g] - l) / h * (this.currentTime - n)
                );
              throw new Error("Format not supported yet");
            }
        }
        return [0, 0, 0];
      }
    }
  }
  tick() {
    this.soundEffects.tick(), this.particleEffects.tick();
    const o = this.animator.getModel().getBoneMap();
    for (let i in this.animationData.bones) {
      const e = o.get(i);
      if (!e)
        continue;
      const { position: n, rotation: s, scale: f } = this.animationData.bones[i], [r, h, l] = [
        n,
        s,
        f
      ].map((g) => this.parseBoneModifier(g));
      if (r) {
        const g = e.position.toArray();
        e.position.set(
          ...r.map(
            (c, p) => (p === 0 ? -1 : 1) * c + g[p]
          )
        );
      }
      if (h) {
        const g = e.rotation.toArray();
        e.rotation.set(
          ...h.map((c) => _.degToRad(c)).map(
            (c, p) => g[p] + (p === 2 ? c : -c)
          )
        );
      }
      l && e.scale.set(...l);
    }
    this.currentTime > this.animationData.animation_length && (this.animationData.loop ? this.loop() : this.pause()), this.lastFrameTimestamp = Date.now();
  }
  play() {
    this.isRunning = !0, this.startTimestamp = Date.now();
  }
  pause() {
    this.isRunning = !1;
  }
  loop() {
    this.startTimestamp = Date.now(), this.soundEffects.reset(), this.particleEffects.reset();
  }
  dispose() {
    this.particleEffects.dispose();
  }
  get currentTime() {
    return (Date.now() - this.startTimestamp) / 1e3;
  }
  get roundedCurrentTime() {
    return Math.round((Date.now() - this.startTimestamp) / 50) / 20;
  }
  get shouldTick() {
    return this.isRunning;
  }
}
class ct {
  constructor(o) {
    this.model = o, this.animations = /* @__PURE__ */ new Map(), this.particleEmitters = /* @__PURE__ */ new Map();
  }
  setupDefaultBonePoses() {
    for (let o of this.model.getBoneMap().values())
      o.userData.defaultRotation = o.rotation.toArray(), o.userData.defaultPosition = o.position.toArray();
  }
  dispose() {
    this.disposeAnimations();
    for (let o of this.model.getBoneMap().values())
      delete o.userData.defaultRotation, delete o.userData.defaultPosition;
  }
  disposeAnimations() {
    this.animations.forEach((o) => o.dispose());
  }
  setupWintersky(o) {
    this.winterskyScene = o;
  }
  addAnimation(o, i) {
    this.animations.set(o, new at(this, i));
  }
  addEmitter(o, i) {
    this.particleEmitters.set(o, i);
  }
  getEmitter(o) {
    return this.particleEmitters.get(o);
  }
  play(o) {
    const i = this.animations.get(o);
    if (!i)
      throw new Error(`Unknown animation: "${o}"`);
    i.play();
  }
  pause(o) {
    const i = this.animations.get(o);
    if (!i)
      throw new Error(`Unknown animation: "${o}"`);
    i.pause();
  }
  pauseAll() {
    for (const o of this.animations.values())
      o.pause();
  }
  tick() {
    for (let o of this.model.getBoneMap().values())
      o.rotation.set(
        ...o.userData.defaultRotation
      ), o.position.set(
        ...o.userData.defaultPosition
      );
    this.animations.forEach(
      (o) => o.shouldTick && o.tick()
    );
  }
  get shouldTick() {
    return [...this.animations.values()].some(
      (o) => o.shouldTick
    );
  }
  getModel() {
    return this.model;
  }
}
const lt = [
  // Right
  {
    /**
     * Position of the texture for this specific cube
     *
     * baseUV[0] <-> X | baseUV[1] <-> Y
     *
     * How baseUV maps to a Minecraft cube texture:
     * @example
     *   | X | 0 | 1 | 2 | 3 |
     * -----------------------
     * Y |   |   |   |   |   |
     * -----------------------
     * 0 |   |   | X | X |   |
     * -----------------------
     * 1 |   | X | X | X | X |
     */
    name: "west",
    baseUV: [2, 1],
    dir: [-1, 0, 0],
    corners: [
      { pos: [-0.5, 1, 0], uv: [0, 1] },
      { pos: [-0.5, 0, 0], uv: [0, 0] },
      { pos: [-0.5, 1, 1], uv: [1, 1] },
      { pos: [-0.5, 0, 1], uv: [1, 0] }
    ]
  },
  // Left
  {
    name: "east",
    baseUV: [0, 1],
    dir: [1, 0, 0],
    corners: [
      { pos: [0.5, 1, 1], uv: [0, 1] },
      { pos: [0.5, 0, 1], uv: [0, 0] },
      { pos: [0.5, 1, 0], uv: [1, 1] },
      { pos: [0.5, 0, 0], uv: [1, 0] }
    ]
  },
  // Bottom
  {
    name: "down",
    baseUV: [2, 0],
    dir: [0, -1, 0],
    corners: [
      { pos: [0.5, 0, 1], uv: [0, 1] },
      { pos: [-0.5, 0, 1], uv: [1, 1] },
      { pos: [0.5, 0, 0], uv: [0, 0] },
      { pos: [-0.5, 0, 0], uv: [1, 0] }
    ]
  },
  // Top
  {
    name: "up",
    baseUV: [1, 0],
    dir: [0, 1, 0],
    corners: [
      { pos: [-0.5, 1, 1], uv: [1, 1] },
      { pos: [0.5, 1, 1], uv: [0, 1] },
      { pos: [-0.5, 1, 0], uv: [1, 0] },
      { pos: [0.5, 1, 0], uv: [0, 0] }
    ]
  },
  //Front
  {
    name: "north",
    baseUV: [1, 1],
    dir: [0, 0, -1],
    corners: [
      { pos: [-0.5, 0, 0], uv: [1, 0] },
      { pos: [0.5, 0, 0], uv: [0, 0] },
      { pos: [-0.5, 1, 0], uv: [1, 1] },
      { pos: [0.5, 1, 0], uv: [0, 1] }
    ]
  },
  //Back
  {
    name: "south",
    baseUV: [3, 1],
    dir: [0, 0, 1],
    corners: [
      { pos: [-0.5, 0, 1], uv: [0, 0] },
      { pos: [0.5, 0, 1], uv: [1, 0] },
      { pos: [-0.5, 1, 1], uv: [0, 1] },
      { pos: [0.5, 1, 1], uv: [1, 1] }
    ]
  }
], K = 0.03;
class ht {
  constructor(o) {
    var d, w;
    this.positions = [], this.indices = [], this.normals = [], this.uvs = [], this.geometry = new Te(), this.group = new H();
    const {
      textureSize: [i, e],
      textureDiscrepancyFactor: [
        n,
        s
      ],
      mirror: f,
      width: r,
      height: h,
      depth: l
    } = o, [g, c] = [
      i * n,
      e * s
    ], p = o.startUV ?? [0, 0], y = !Array.isArray(p);
    let b = 0, A = 0;
    y || ([b, A] = p);
    for (let {
      name: m,
      dir: P,
      corners: R,
      baseUV: [u, Y]
    } of lt) {
      const j = this.positions.length / 3;
      let x, M;
      if (y) {
        if (p[m] === void 0)
          continue;
        [b, A] = ((d = p[m]) == null ? void 0 : d.uv) || [], [x, M] = ((w = p[m]) == null ? void 0 : w.uv_size) || [], x *= n, M *= s, b *= n, A *= s, u = 0, Y = 0;
      }
      for (const {
        pos: [z, X, B],
        uv: k
      } of R)
        this.positions.push(
          (f ? -z : z) * r,
          X * h,
          B * l
        ), this.normals.push(...P), this.uvs.push(
          //Base offset of the current cube
          (b + //Horizontal offset for the current face
          (+(u > 0) + +(u > 2)) * Math.floor(x ?? l) + +(u > 1) * Math.floor(x ?? r) + //Face corner specific offsets
          k[0] * Math.floor(m === "west" || m === "east" ? x ?? l : x ?? r) + (k[0] === 0 ? K : -K)) / (g / (y ? 1 : n)),
          //Align uv to top left corner
          1 - //Base offset of the current cube
          (A + //Vertical offset for the current face
          Y * Math.floor(M ?? l) + Math.floor(m === "up" || m === "down" ? M ?? l : M ?? h) - //Face corner specific offsets
          k[1] * Math.floor(m === "up" || m === "down" ? M ?? l : M ?? h) + (k[1] === 0 ? -K : K)) / (c / (y ? 1 : s))
        );
      this.indices.push(j, j + 1, j + 2, j + 2, j + 1, j + 3);
    }
    this.createGeometry(), this.createMesh(o);
  }
  createGeometry() {
    this.geometry.setAttribute(
      "position",
      new G(new Float32Array(this.positions), 3)
    ), this.geometry.setAttribute(
      "normal",
      new G(new Float32Array(this.normals), 3)
    ), this.geometry.setAttribute(
      "uv",
      new G(new Float32Array(this.uvs), 2)
    ), this.geometry.setIndex(this.indices);
  }
  createMesh({
    material: o,
    width: i,
    height: e,
    depth: n,
    pivot: s,
    rotation: f,
    origin: r,
    inflate: h = 0
  }) {
    const l = h * 2 + i, g = new Ae(this.geometry, o);
    if (this.group.rotation.order = "ZYX", s === void 0 && (s = [l / 2, e / 2, n / 2]), this.group.add(g), f) {
      this.group.position.set(-s[0], s[1], s[2]), g.position.set(
        -r[0] - l / 2 + s[0] + h,
        r[1] - s[1] - h,
        r[2] - s[2] - h
      );
      const [c, p, y] = f;
      this.group.rotation.set(
        _.degToRad(-c),
        _.degToRad(-p),
        _.degToRad(y)
      );
    } else
      this.group.position.set(
        -r[0] - l / 2 + h,
        r[1] - h,
        r[2] - h
      );
    h && this.group.scale.set(
      i !== 0 ? 1 + h / (i / 2) : 1,
      e !== 0 ? 1 + h / (e / 2) : 1,
      n !== 0 ? 1 + h / (n / 2) : 1
    );
  }
  getGroup() {
    return this.group;
  }
}
class ut {
  constructor(o) {
    var e, n, s, f;
    if (this.positions = [], this.indices = [], this.normals = [], this.uvs = [], this.geometry = new Te(), this.group = new H(), !Array.isArray(o.polys))
      throw new Error("Format not supported yet!");
    o.normalized_uvs || (o.uvs = (e = o == null ? void 0 : o.uvs) == null ? void 0 : e.map(([r, h]) => [
      r / o.textureSize[0],
      h / o.textureSize[1]
    ]));
    let i = 0;
    for (const r of o.polys) {
      for (const [h, l, g] of r)
        this.positions.push(
          ...((n = o == null ? void 0 : o.positions) == null ? void 0 : n[h]) ?? []
        ), this.normals.push(
          ...((s = o == null ? void 0 : o.normals) == null ? void 0 : s[l]) ?? []
        ), this.uvs.push(...((f = o == null ? void 0 : o.uvs) == null ? void 0 : f[g]) ?? []);
      r.length === 3 ? this.indices.push(i, i + 1, i + 2) : this.indices.push(i + 2, i + 1, i, i + 2, i, i + 3), i += r.length;
    }
    this.createGeometry(), this.createMesh(o);
  }
  createGeometry() {
    this.geometry.setAttribute(
      "position",
      new G(new Float32Array(this.positions), 3)
    ), this.geometry.setAttribute(
      "normal",
      new G(new Float32Array(this.normals), 3)
    ), this.geometry.setAttribute(
      "uv",
      new G(new Float32Array(this.uvs), 2)
    ), this.geometry.setIndex(this.indices);
  }
  createMesh({ material: o }) {
    const i = new Ae(this.geometry, o);
    this.group.add(i);
  }
  getGroup() {
    return this.group;
  }
}
class dt {
  constructor(o, i) {
    var n;
    this.modelData = o, this.texturePath = i, this.boneMap = /* @__PURE__ */ new Map(), this.locators = /* @__PURE__ */ new Map(), this.animator = new ct(this);
    const e = ((n = o == null ? void 0 : o.description) == null ? void 0 : n.identifier) ?? "geometry.unknown";
    this.model = new H(), this.model.name = e;
  }
  async create() {
    var r, h, l, g;
    const o = this.modelData, i = await this.loadTexture(this.texturePath), e = [
      ((r = o == null ? void 0 : o.description) == null ? void 0 : r.texture_width) ?? i.image.width,
      ((h = o == null ? void 0 : o.description) == null ? void 0 : h.texture_height) ?? i.image.height
    ], n = [
      i.image.width / e[0],
      i.image.height / e[1]
    ], s = /* @__PURE__ */ new Map();
    i.magFilter = ye, i.minFilter = ye;
    const f = new De({
      side: we,
      alphaTest: 0.2,
      transparent: !0,
      map: i
    });
    (l = o == null ? void 0 : o.bones) == null || l.forEach((c) => {
      var A;
      const p = new H();
      if (p.name = c.name ?? "unknown", c.poly_mesh) {
        const d = new ut({
          ...c.poly_mesh,
          textureSize: e,
          material: f,
          mirror: c.mirror ?? !1,
          origin: [0, 0, 0],
          inflate: c.inflate,
          rotation: [0, 0, 0],
          pivot: c.pivot
        }).getGroup();
        d.name = `#bone.${c.name}#polyMesh`, p.add(d);
      }
      (A = c.cubes) == null || A.forEach((d, w) => {
        var P, R, u;
        const m = new ht({
          width: ((P = d.size) == null ? void 0 : P[0]) ?? 0,
          height: ((R = d.size) == null ? void 0 : R[1]) ?? 0,
          depth: ((u = d.size) == null ? void 0 : u[2]) ?? 0,
          startUV: d.uv,
          textureSize: e,
          textureDiscrepancyFactor: n,
          material: f,
          mirror: d.mirror === void 0 && d.rotation === void 0 ? c.mirror ?? !1 : d.mirror ?? !1,
          origin: d.origin ?? [0, 0, 0],
          inflate: d.inflate ?? c.inflate,
          rotation: d.rotation,
          pivot: d.pivot ?? c.pivot
        }).getGroup();
        m.name = `#bone.${c.name}#cube.${w}`, p.add(m);
      });
      const y = new H();
      if (y.rotation.order = "ZYX", c.pivot) {
        const [d, w, m] = c.pivot;
        y.position.set(-d, w, m), p.position.set(d, -w, -m);
      } else
        y.position.set(0, 0, 0);
      if (y.add(p), y.name = `#pivot.${c.name}`, c.rotation) {
        const [d, w, m] = c.rotation;
        y.rotation.set(
          _.degToRad(-d),
          _.degToRad(-w),
          _.degToRad(m)
        );
      }
      const b = c.locators ?? {};
      for (const d in b) {
        const w = new H();
        w.name = `locator#${d}`;
        const m = b[d];
        Array.isArray(m) ? w.position.set(...m) : typeof m == "object" && (w.position.set(...m.offset ?? [0, 0, 0]), w.rotation.set(...m.rotation ?? [0, 0, 0])), this.locators.set(d, w), y.add(w);
      }
      c.parent || this.model.add(y), c.name && (s.set(c.name, [c.parent, y]), this.boneMap.set(c.name, y));
    });
    for (let [c, [p, y]] of s)
      if (p) {
        const b = (g = s.get(p)) == null ? void 0 : g[1];
        b && b.name.startsWith("#pivot.") ? b.children[0].add(y) : b && b.add(y);
      }
    this.animator.setupDefaultBonePoses();
  }
  getGroup() {
    return this.model;
  }
  getBoneMap() {
    return this.boneMap;
  }
  getLocator(o) {
    return this.locators.get(o);
  }
  tick() {
    this.animator.tick();
  }
  get shouldTick() {
    return this.animator.shouldTick;
  }
  createOutlineBox(o, i, e) {
    const n = new He({
      side: we,
      color: o,
      linewidth: 20
    }), s = new Ge(e.x, e.y, e.z), f = new Xe(s), r = new Be(f, n);
    return r.position.set(i.x, i.y + e.y / 2, i.z), r.name = "helperBox", this.model.add(r), {
      dispose: () => {
        this.model.remove(r);
      }
    };
  }
  hideBone(o) {
    const i = this.boneMap.get(o);
    i && (i.visible = !1);
  }
  showBone(o) {
    const i = this.boneMap.get(o);
    i && (i.visible = !0);
  }
  get bones() {
    return [...this.boneMap.keys()];
  }
  dispose() {
    this.animator.dispose();
  }
  loadTexture(o) {
    return new Promise((i, e) => {
      new Ze().load(o, (s) => {
        i(s);
      });
    });
  }
}
class gt {
  constructor(o, i, e, n) {
    this.canvasElement = o, this.texturePath = e, this.options = n, this.renderingRequested = !1, this.renderer = new Ke({
      canvas: o,
      antialias: n.antialias ?? !1
    }), this.renderer.setPixelRatio(window.devicePixelRatio), this.camera = new Ve(70, 2, 0.1, 1e3), this.camera.position.x = -20, this.camera.position.y = 20, this.camera.position.z = -20, this.camera.updateProjectionMatrix(), this.controls = new nt(this.camera, o), this.scene = new qe(), this.scene.add(new Ce(16777215)), this.scene.background = new We(13299960), this.model = new dt(i, e), this.scene.add(this.model.getGroup()), window.addEventListener("resize", this.onResize.bind(this)), this.controls.addEventListener("change", () => this.requestRendering()), this.onResize(), this.loadedModel = this.loadModel().then(() => this.requestRendering());
  }
  async loadModel() {
    await this.model.create();
  }
  get width() {
    return this.options.width ?? window.innerWidth;
  }
  get height() {
    return this.options.height ?? window.innerHeight;
  }
  render(o = !0) {
    var i;
    this.controls.update(), this.renderer.render(this.scene, this.camera), this.renderingRequested = !1, o && this.model.shouldTick && (this.model.tick(), (i = this.model.animator.winterskyScene) == null || i.updateFacingRotation(
      this.camera
    ), this.requestRendering());
  }
  requestRendering(o = !1) {
    if (o)
      return this.render(!1);
    this.renderingRequested || (this.renderingRequested = !0, requestAnimationFrame(() => this.render()));
  }
  onResize() {
    this.renderer.setSize(this.width, this.height, !0), this.camera.aspect = this.width / this.height, this.positionCamera(), this.requestRendering();
  }
  dispose() {
    window.removeEventListener("resize", this.onResize), this.controls.removeEventListener("change", this.requestRendering);
  }
  addHelpers() {
    this.scene.add(new $e(50)), this.scene.add(new Qe(20, 20)), this.scene.add(new Je(this.model.getGroup(), 16776960)), this.requestRendering();
  }
  getModel() {
    return this.model;
  }
  // From: https://github.com/mrdoob/three.js/issues/6784#issuecomment-315963625
  positionCamera(o = 1.5, i = !0) {
    i && this.model.getGroup().rotation.set(0, Math.PI, 0);
    const e = new et().setFromObject(this.model.getGroup()).getBoundingSphere(new tt()), n = this.camera.fov * Math.PI / 180 * o, s = e.radius / Math.tan(n / 2), f = Math.sqrt(
      Math.pow(s, 2) + Math.pow(s, 2)
    );
    this.camera.position.set(f, f, f), this.controls.update(), this.camera.lookAt(e.center), this.controls.target.set(
      e.center.x,
      e.center.y,
      e.center.z
    ), this.camera.updateProjectionMatrix();
  }
}
export {
  dt as Model,
  gt as StandaloneModelViewer
};
