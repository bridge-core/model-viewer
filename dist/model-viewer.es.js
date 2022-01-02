var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { EventDispatcher, Vector3, MOUSE, TOUCH, Quaternion, Spherical, Vector2, MathUtils, BufferGeometry, Group, BufferAttribute, Mesh, NearestFilter, MeshLambertMaterial, DoubleSide, LineBasicMaterial, BoxGeometry, EdgesGeometry, LineSegments, TextureLoader, WebGLRenderer, PerspectiveCamera, Scene, AmbientLight, Color, AxesHelper, GridHelper, BoxHelper, Box3, Sphere } from "three";
import { MoLang } from "molang";
import Wintersky from "wintersky";
const _changeEvent = { type: "change" };
const _startEvent = { type: "start" };
const _endEvent = { type: "end" };
class OrbitControls extends EventDispatcher {
  constructor(object, domElement) {
    super();
    if (domElement === void 0)
      console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.');
    if (domElement === document)
      console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');
    this.object = object;
    this.domElement = domElement;
    this.domElement.style.touchAction = "none";
    this.enabled = true;
    this.target = new Vector3();
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minZoom = 0;
    this.maxZoom = Infinity;
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    this.minAzimuthAngle = -Infinity;
    this.maxAzimuthAngle = Infinity;
    this.enableDamping = false;
    this.dampingFactor = 0.05;
    this.enableZoom = true;
    this.zoomSpeed = 1;
    this.enableRotate = true;
    this.rotateSpeed = 1;
    this.enablePan = true;
    this.panSpeed = 1;
    this.screenSpacePanning = true;
    this.keyPanSpeed = 7;
    this.autoRotate = false;
    this.autoRotateSpeed = 2;
    this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" };
    this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };
    this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;
    this._domElementKeyEvents = null;
    this.getPolarAngle = function() {
      return spherical.phi;
    };
    this.getAzimuthalAngle = function() {
      return spherical.theta;
    };
    this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    };
    this.listenToKeyEvents = function(domElement2) {
      domElement2.addEventListener("keydown", onKeyDown);
      this._domElementKeyEvents = domElement2;
    };
    this.saveState = function() {
      scope.target0.copy(scope.target);
      scope.position0.copy(scope.object.position);
      scope.zoom0 = scope.object.zoom;
    };
    this.reset = function() {
      scope.target.copy(scope.target0);
      scope.object.position.copy(scope.position0);
      scope.object.zoom = scope.zoom0;
      scope.object.updateProjectionMatrix();
      scope.dispatchEvent(_changeEvent);
      scope.update();
      state = STATE.NONE;
    };
    this.update = function() {
      const offset = new Vector3();
      const quat = new Quaternion().setFromUnitVectors(object.up, new Vector3(0, 1, 0));
      const quatInverse = quat.clone().invert();
      const lastPosition = new Vector3();
      const lastQuaternion = new Quaternion();
      const twoPI = 2 * Math.PI;
      return function update() {
        const position = scope.object.position;
        offset.copy(position).sub(scope.target);
        offset.applyQuaternion(quat);
        spherical.setFromVector3(offset);
        if (scope.autoRotate && state === STATE.NONE) {
          rotateLeft(getAutoRotationAngle());
        }
        if (scope.enableDamping) {
          spherical.theta += sphericalDelta.theta * scope.dampingFactor;
          spherical.phi += sphericalDelta.phi * scope.dampingFactor;
        } else {
          spherical.theta += sphericalDelta.theta;
          spherical.phi += sphericalDelta.phi;
        }
        let min = scope.minAzimuthAngle;
        let max = scope.maxAzimuthAngle;
        if (isFinite(min) && isFinite(max)) {
          if (min < -Math.PI)
            min += twoPI;
          else if (min > Math.PI)
            min -= twoPI;
          if (max < -Math.PI)
            max += twoPI;
          else if (max > Math.PI)
            max -= twoPI;
          if (min <= max) {
            spherical.theta = Math.max(min, Math.min(max, spherical.theta));
          } else {
            spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
          }
        }
        spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
        spherical.makeSafe();
        spherical.radius *= scale;
        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
        if (scope.enableDamping === true) {
          scope.target.addScaledVector(panOffset, scope.dampingFactor);
        } else {
          scope.target.add(panOffset);
        }
        offset.setFromSpherical(spherical);
        offset.applyQuaternion(quatInverse);
        position.copy(scope.target).add(offset);
        scope.object.lookAt(scope.target);
        if (scope.enableDamping === true) {
          sphericalDelta.theta *= 1 - scope.dampingFactor;
          sphericalDelta.phi *= 1 - scope.dampingFactor;
          panOffset.multiplyScalar(1 - scope.dampingFactor);
        } else {
          sphericalDelta.set(0, 0, 0);
          panOffset.set(0, 0, 0);
        }
        scale = 1;
        if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          scope.dispatchEvent(_changeEvent);
          lastPosition.copy(scope.object.position);
          lastQuaternion.copy(scope.object.quaternion);
          zoomChanged = false;
          return true;
        }
        return false;
      };
    }();
    this.dispose = function() {
      scope.domElement.removeEventListener("contextmenu", onContextMenu);
      scope.domElement.removeEventListener("pointerdown", onPointerDown);
      scope.domElement.removeEventListener("pointercancel", onPointerCancel);
      scope.domElement.removeEventListener("wheel", onMouseWheel);
      scope.domElement.removeEventListener("pointermove", onPointerMove);
      scope.domElement.removeEventListener("pointerup", onPointerUp);
      if (scope._domElementKeyEvents !== null) {
        scope._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
      }
    };
    const scope = this;
    const STATE = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let state = STATE.NONE;
    const EPS = 1e-6;
    const spherical = new Spherical();
    const sphericalDelta = new Spherical();
    let scale = 1;
    const panOffset = new Vector3();
    let zoomChanged = false;
    const rotateStart = new Vector2();
    const rotateEnd = new Vector2();
    const rotateDelta = new Vector2();
    const panStart = new Vector2();
    const panEnd = new Vector2();
    const panDelta = new Vector2();
    const dollyStart = new Vector2();
    const dollyEnd = new Vector2();
    const dollyDelta = new Vector2();
    const pointers = [];
    const pointerPositions = {};
    function getAutoRotationAngle() {
      return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }
    function getZoomScale() {
      return Math.pow(0.95, scope.zoomSpeed);
    }
    function rotateLeft(angle) {
      sphericalDelta.theta -= angle;
    }
    function rotateUp(angle) {
      sphericalDelta.phi -= angle;
    }
    const panLeft = function() {
      const v = new Vector3();
      return function panLeft2(distance, objectMatrix) {
        v.setFromMatrixColumn(objectMatrix, 0);
        v.multiplyScalar(-distance);
        panOffset.add(v);
      };
    }();
    const panUp = function() {
      const v = new Vector3();
      return function panUp2(distance, objectMatrix) {
        if (scope.screenSpacePanning === true) {
          v.setFromMatrixColumn(objectMatrix, 1);
        } else {
          v.setFromMatrixColumn(objectMatrix, 0);
          v.crossVectors(scope.object.up, v);
        }
        v.multiplyScalar(distance);
        panOffset.add(v);
      };
    }();
    const pan = function() {
      const offset = new Vector3();
      return function pan2(deltaX, deltaY) {
        const element = scope.domElement;
        if (scope.object.isPerspectiveCamera) {
          const position = scope.object.position;
          offset.copy(position).sub(scope.target);
          let targetDistance = offset.length();
          targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180);
          panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
          panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
        } else if (scope.object.isOrthographicCamera) {
          panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
          panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
        } else {
          console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
          scope.enablePan = false;
        }
      };
    }();
    function dollyOut(dollyScale) {
      if (scope.object.isPerspectiveCamera) {
        scale /= dollyScale;
      } else if (scope.object.isOrthographicCamera) {
        scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
        scope.object.updateProjectionMatrix();
        zoomChanged = true;
      } else {
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
        scope.enableZoom = false;
      }
    }
    function dollyIn(dollyScale) {
      if (scope.object.isPerspectiveCamera) {
        scale *= dollyScale;
      } else if (scope.object.isOrthographicCamera) {
        scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
        scope.object.updateProjectionMatrix();
        zoomChanged = true;
      } else {
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
        scope.enableZoom = false;
      }
    }
    function handleMouseDownRotate(event) {
      rotateStart.set(event.clientX, event.clientY);
    }
    function handleMouseDownDolly(event) {
      dollyStart.set(event.clientX, event.clientY);
    }
    function handleMouseDownPan(event) {
      panStart.set(event.clientX, event.clientY);
    }
    function handleMouseMoveRotate(event) {
      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
      const element = scope.domElement;
      rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
      rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
      rotateStart.copy(rotateEnd);
      scope.update();
    }
    function handleMouseMoveDolly(event) {
      dollyEnd.set(event.clientX, event.clientY);
      dollyDelta.subVectors(dollyEnd, dollyStart);
      if (dollyDelta.y > 0) {
        dollyOut(getZoomScale());
      } else if (dollyDelta.y < 0) {
        dollyIn(getZoomScale());
      }
      dollyStart.copy(dollyEnd);
      scope.update();
    }
    function handleMouseMovePan(event) {
      panEnd.set(event.clientX, event.clientY);
      panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
      pan(panDelta.x, panDelta.y);
      panStart.copy(panEnd);
      scope.update();
    }
    function handleMouseWheel(event) {
      if (event.deltaY < 0) {
        dollyIn(getZoomScale());
      } else if (event.deltaY > 0) {
        dollyOut(getZoomScale());
      }
      scope.update();
    }
    function handleKeyDown(event) {
      let needsUpdate = false;
      switch (event.code) {
        case scope.keys.UP:
          pan(0, scope.keyPanSpeed);
          needsUpdate = true;
          break;
        case scope.keys.BOTTOM:
          pan(0, -scope.keyPanSpeed);
          needsUpdate = true;
          break;
        case scope.keys.LEFT:
          pan(scope.keyPanSpeed, 0);
          needsUpdate = true;
          break;
        case scope.keys.RIGHT:
          pan(-scope.keyPanSpeed, 0);
          needsUpdate = true;
          break;
      }
      if (needsUpdate) {
        event.preventDefault();
        scope.update();
      }
    }
    function handleTouchStartRotate() {
      if (pointers.length === 1) {
        rotateStart.set(pointers[0].pageX, pointers[0].pageY);
      } else {
        const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
        const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
        rotateStart.set(x, y);
      }
    }
    function handleTouchStartPan() {
      if (pointers.length === 1) {
        panStart.set(pointers[0].pageX, pointers[0].pageY);
      } else {
        const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
        const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
        panStart.set(x, y);
      }
    }
    function handleTouchStartDolly() {
      const dx = pointers[0].pageX - pointers[1].pageX;
      const dy = pointers[0].pageY - pointers[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      dollyStart.set(0, distance);
    }
    function handleTouchStartDollyPan() {
      if (scope.enableZoom)
        handleTouchStartDolly();
      if (scope.enablePan)
        handleTouchStartPan();
    }
    function handleTouchStartDollyRotate() {
      if (scope.enableZoom)
        handleTouchStartDolly();
      if (scope.enableRotate)
        handleTouchStartRotate();
    }
    function handleTouchMoveRotate(event) {
      if (pointers.length == 1) {
        rotateEnd.set(event.pageX, event.pageY);
      } else {
        const position = getSecondPointerPosition(event);
        const x = 0.5 * (event.pageX + position.x);
        const y = 0.5 * (event.pageY + position.y);
        rotateEnd.set(x, y);
      }
      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
      const element = scope.domElement;
      rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
      rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
      rotateStart.copy(rotateEnd);
    }
    function handleTouchMovePan(event) {
      if (pointers.length === 1) {
        panEnd.set(event.pageX, event.pageY);
      } else {
        const position = getSecondPointerPosition(event);
        const x = 0.5 * (event.pageX + position.x);
        const y = 0.5 * (event.pageY + position.y);
        panEnd.set(x, y);
      }
      panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
      pan(panDelta.x, panDelta.y);
      panStart.copy(panEnd);
    }
    function handleTouchMoveDolly(event) {
      const position = getSecondPointerPosition(event);
      const dx = event.pageX - position.x;
      const dy = event.pageY - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      dollyEnd.set(0, distance);
      dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
      dollyOut(dollyDelta.y);
      dollyStart.copy(dollyEnd);
    }
    function handleTouchMoveDollyPan(event) {
      if (scope.enableZoom)
        handleTouchMoveDolly(event);
      if (scope.enablePan)
        handleTouchMovePan(event);
    }
    function handleTouchMoveDollyRotate(event) {
      if (scope.enableZoom)
        handleTouchMoveDolly(event);
      if (scope.enableRotate)
        handleTouchMoveRotate(event);
    }
    function onPointerDown(event) {
      if (scope.enabled === false)
        return;
      if (pointers.length === 0) {
        scope.domElement.setPointerCapture(event.pointerId);
        scope.domElement.addEventListener("pointermove", onPointerMove);
        scope.domElement.addEventListener("pointerup", onPointerUp);
      }
      addPointer(event);
      if (event.pointerType === "touch") {
        onTouchStart(event);
      } else {
        onMouseDown(event);
      }
    }
    function onPointerMove(event) {
      if (scope.enabled === false)
        return;
      if (event.pointerType === "touch") {
        onTouchMove(event);
      } else {
        onMouseMove(event);
      }
    }
    function onPointerUp(event) {
      removePointer(event);
      if (pointers.length === 0) {
        scope.domElement.releasePointerCapture(event.pointerId);
        scope.domElement.removeEventListener("pointermove", onPointerMove);
        scope.domElement.removeEventListener("pointerup", onPointerUp);
      }
      scope.dispatchEvent(_endEvent);
      state = STATE.NONE;
    }
    function onPointerCancel(event) {
      removePointer(event);
    }
    function onMouseDown(event) {
      let mouseAction;
      switch (event.button) {
        case 0:
          mouseAction = scope.mouseButtons.LEFT;
          break;
        case 1:
          mouseAction = scope.mouseButtons.MIDDLE;
          break;
        case 2:
          mouseAction = scope.mouseButtons.RIGHT;
          break;
        default:
          mouseAction = -1;
      }
      switch (mouseAction) {
        case MOUSE.DOLLY:
          if (scope.enableZoom === false)
            return;
          handleMouseDownDolly(event);
          state = STATE.DOLLY;
          break;
        case MOUSE.ROTATE:
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (scope.enablePan === false)
              return;
            handleMouseDownPan(event);
            state = STATE.PAN;
          } else {
            if (scope.enableRotate === false)
              return;
            handleMouseDownRotate(event);
            state = STATE.ROTATE;
          }
          break;
        case MOUSE.PAN:
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (scope.enableRotate === false)
              return;
            handleMouseDownRotate(event);
            state = STATE.ROTATE;
          } else {
            if (scope.enablePan === false)
              return;
            handleMouseDownPan(event);
            state = STATE.PAN;
          }
          break;
        default:
          state = STATE.NONE;
      }
      if (state !== STATE.NONE) {
        scope.dispatchEvent(_startEvent);
      }
    }
    function onMouseMove(event) {
      if (scope.enabled === false)
        return;
      switch (state) {
        case STATE.ROTATE:
          if (scope.enableRotate === false)
            return;
          handleMouseMoveRotate(event);
          break;
        case STATE.DOLLY:
          if (scope.enableZoom === false)
            return;
          handleMouseMoveDolly(event);
          break;
        case STATE.PAN:
          if (scope.enablePan === false)
            return;
          handleMouseMovePan(event);
          break;
      }
    }
    function onMouseWheel(event) {
      if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE)
        return;
      event.preventDefault();
      scope.dispatchEvent(_startEvent);
      handleMouseWheel(event);
      scope.dispatchEvent(_endEvent);
    }
    function onKeyDown(event) {
      if (scope.enabled === false || scope.enablePan === false)
        return;
      handleKeyDown(event);
    }
    function onTouchStart(event) {
      trackPointer(event);
      switch (pointers.length) {
        case 1:
          switch (scope.touches.ONE) {
            case TOUCH.ROTATE:
              if (scope.enableRotate === false)
                return;
              handleTouchStartRotate();
              state = STATE.TOUCH_ROTATE;
              break;
            case TOUCH.PAN:
              if (scope.enablePan === false)
                return;
              handleTouchStartPan();
              state = STATE.TOUCH_PAN;
              break;
            default:
              state = STATE.NONE;
          }
          break;
        case 2:
          switch (scope.touches.TWO) {
            case TOUCH.DOLLY_PAN:
              if (scope.enableZoom === false && scope.enablePan === false)
                return;
              handleTouchStartDollyPan();
              state = STATE.TOUCH_DOLLY_PAN;
              break;
            case TOUCH.DOLLY_ROTATE:
              if (scope.enableZoom === false && scope.enableRotate === false)
                return;
              handleTouchStartDollyRotate();
              state = STATE.TOUCH_DOLLY_ROTATE;
              break;
            default:
              state = STATE.NONE;
          }
          break;
        default:
          state = STATE.NONE;
      }
      if (state !== STATE.NONE) {
        scope.dispatchEvent(_startEvent);
      }
    }
    function onTouchMove(event) {
      trackPointer(event);
      switch (state) {
        case STATE.TOUCH_ROTATE:
          if (scope.enableRotate === false)
            return;
          handleTouchMoveRotate(event);
          scope.update();
          break;
        case STATE.TOUCH_PAN:
          if (scope.enablePan === false)
            return;
          handleTouchMovePan(event);
          scope.update();
          break;
        case STATE.TOUCH_DOLLY_PAN:
          if (scope.enableZoom === false && scope.enablePan === false)
            return;
          handleTouchMoveDollyPan(event);
          scope.update();
          break;
        case STATE.TOUCH_DOLLY_ROTATE:
          if (scope.enableZoom === false && scope.enableRotate === false)
            return;
          handleTouchMoveDollyRotate(event);
          scope.update();
          break;
        default:
          state = STATE.NONE;
      }
    }
    function onContextMenu(event) {
      if (scope.enabled === false)
        return;
      event.preventDefault();
    }
    function addPointer(event) {
      pointers.push(event);
    }
    function removePointer(event) {
      delete pointerPositions[event.pointerId];
      for (let i = 0; i < pointers.length; i++) {
        if (pointers[i].pointerId == event.pointerId) {
          pointers.splice(i, 1);
          return;
        }
      }
    }
    function trackPointer(event) {
      let position = pointerPositions[event.pointerId];
      if (position === void 0) {
        position = new Vector2();
        pointerPositions[event.pointerId] = position;
      }
      position.set(event.pageX, event.pageY);
    }
    function getSecondPointerPosition(event) {
      const pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
      return pointerPositions[pointer.pointerId];
    }
    scope.domElement.addEventListener("contextmenu", onContextMenu);
    scope.domElement.addEventListener("pointerdown", onPointerDown);
    scope.domElement.addEventListener("pointercancel", onPointerCancel);
    scope.domElement.addEventListener("wheel", onMouseWheel, { passive: false });
    this.update();
  }
}
class AnimationEffect {
  constructor(animation, timestampObj) {
    this.animation = animation;
    this.currentEffectIndex = 0;
    this.tickingEffects = [];
    this.effects = Object.entries(timestampObj).map(([time, timestampEntry]) => [
      Number(time),
      Array.isArray(timestampEntry) ? timestampEntry : [timestampEntry]
    ]).sort(([a], [b]) => a - b);
  }
  getCurrentEffects() {
    if (this.currentEffectIndex >= this.effects.length)
      return;
    const currentEffect = this.effects[this.currentEffectIndex];
    if (currentEffect[0] > this.animation.roundedCurrentTime)
      return;
    this.currentEffectIndex++;
    return currentEffect[1];
  }
  reset() {
    this.currentEffectIndex = 0;
  }
}
class SoundEffect extends AnimationEffect {
  tick() {
    var _a;
    const timestampEntry = (_a = super.getCurrentEffects()) != null ? _a : [];
    if (timestampEntry.length > 0)
      console.log(`Playing sound effects: "${timestampEntry.map((entry) => entry.effect).join(", ")}"`);
  }
}
class ParticleEffect extends AnimationEffect {
  constructor() {
    super(...arguments);
    this.disposables = [];
  }
  tick() {
    var _a;
    this.tickingEffects.forEach((effect) => effect.tick());
    const currentEffects = (_a = super.getCurrentEffects()) != null ? _a : [];
    for (const { locator, effect, pre_effect_script } of currentEffects) {
      if (!effect)
        return;
      const animator = this.animation.getAnimator();
      const model = animator.getModel();
      const emitterConfig = animator.getEmitter(effect);
      if (!emitterConfig || !animator.winterskyScene)
        return;
      const locatorGroup = locator ? model.getLocator(locator) : void 0;
      const emitter = new Wintersky.Emitter(animator.winterskyScene, emitterConfig, {
        parent_mode: locatorGroup ? "locator" : "entity",
        loop_mode: "once"
      });
      if (locatorGroup) {
        locatorGroup.add(emitter.local_space);
        emitter.local_space.parent = locatorGroup;
      }
      const tickable = {
        tick: () => {
          emitter.tick();
          if (!emitter.enabled) {
            emitter.delete();
            this.tickingEffects = this.tickingEffects.filter((current) => current !== tickable);
          }
        }
      };
      this.tickingEffects.push(tickable);
      this.disposables.push({
        dispose: () => {
          emitter.delete();
          this.tickingEffects = this.tickingEffects.filter((current) => current !== tickable);
        }
      });
      emitter.start();
      emitter.tick();
    }
  }
  dispose() {
    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];
  }
}
class Animation {
  constructor(animator, animationData) {
    var _a, _b;
    this.animator = animator;
    this.animationData = animationData;
    this.startTimestamp = 0;
    this.lastFrameTimestamp = 0;
    this.isRunning = false;
    this.env = {
      "query.anim_time": () => this.currentTime,
      "query.delta_time": () => this.startTimestamp - this.lastFrameTimestamp,
      "query.life_time": () => this.currentTime
    };
    this.molang = new MoLang(this.env);
    this.soundEffects = new SoundEffect(this, (_a = this.animationData.sound_effects) != null ? _a : {});
    this.particleEffects = new ParticleEffect(this, (_b = this.animationData.particle_effects) != null ? _b : {});
  }
  getAnimator() {
    return this.animator;
  }
  execute(expr) {
    return this.molang.executeAndCatch(expr);
  }
  parseBoneModifier(transform) {
    if (typeof transform === "number") {
      return [transform, transform, transform];
    } else if (typeof transform === "string") {
      const res = typeof transform === "string" ? this.execute(transform) : transform;
      return [res, res, res];
    } else if (Array.isArray(transform)) {
      return transform.map((t) => typeof t === "string" ? this.execute(t) : t);
    } else if (transform !== void 0) {
      const timestamps = Object.entries(transform).map(([time, transform2]) => [Number(time), transform2]).sort(([a], [b]) => a - b);
      for (let i = timestamps.length - 1; i >= 0; i--) {
        let [time, transform2] = timestamps[i];
        if (time > this.currentTime) {
          continue;
        } else if (time === this.currentTime) {
          if (Array.isArray(transform2)) {
            return transform2;
          } else {
            throw new Error("Format not supported yet");
          }
        } else {
          let [nextTime, nextTransform] = timestamps[MathUtils.euclideanModulo(i + 1, timestamps.length)];
          let timeDelta = nextTime - time;
          if (Array.isArray(transform2) && Array.isArray(nextTransform)) {
            return transform2.map((n, i2) => n + (nextTransform[i2] - n) / timeDelta * (this.currentTime - time));
          } else {
            throw new Error("Format not supported yet");
          }
        }
      }
      return [0, 0, 0];
    }
  }
  tick() {
    this.soundEffects.tick();
    this.particleEffects.tick();
    const boneMap = this.animator.getModel().getBoneMap();
    for (let boneName in this.animationData.bones) {
      const bone = boneMap.get(boneName);
      if (!bone)
        continue;
      const { position, rotation, scale } = this.animationData.bones[boneName];
      const [positionMod, rotationMod, scaleMod] = [
        position,
        rotation,
        scale
      ].map((mod) => this.parseBoneModifier(mod));
      if (positionMod) {
        const currentPosition = bone.position.toArray();
        bone.position.set(...positionMod.map((val, i) => (i === 0 ? -1 : 1) * val + currentPosition[i]));
      }
      if (rotationMod) {
        const currentRotation = bone.rotation.toArray();
        bone.rotation.set(...rotationMod.map(MathUtils.degToRad).map((val, i) => currentRotation[i] + (i === 2 ? val : -val)));
      }
      if (scaleMod)
        bone.scale.set(...scaleMod);
    }
    if (this.currentTime > this.animationData.animation_length) {
      if (this.animationData.loop)
        this.loop();
      else
        this.pause();
    }
    this.lastFrameTimestamp = Date.now();
  }
  play() {
    this.isRunning = true;
    this.startTimestamp = Date.now();
  }
  pause() {
    this.isRunning = false;
  }
  loop() {
    this.startTimestamp = Date.now();
    this.soundEffects.reset();
    this.particleEffects.reset();
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
class Animator {
  constructor(model) {
    this.model = model;
    this.animations = new Map();
    this.particleEmitters = new Map();
  }
  setupDefaultBonePoses() {
    for (let bone of this.model.getBoneMap().values()) {
      bone.userData.defaultRotation = bone.rotation.toArray();
      bone.userData.defaultPosition = bone.position.toArray();
    }
  }
  dispose() {
    this.disposeAnimations();
    for (let bone of this.model.getBoneMap().values()) {
      delete bone.userData.defaultRotation;
      delete bone.userData.defaultPosition;
    }
  }
  disposeAnimations() {
    this.animations.forEach((anim) => anim.dispose());
  }
  setupWintersky(winterskyScene) {
    this.winterskyScene = winterskyScene;
  }
  addAnimation(id, animationData) {
    this.animations.set(id, new Animation(this, animationData));
  }
  addEmitter(shortName, emitterConfig) {
    this.particleEmitters.set(shortName, emitterConfig);
  }
  getEmitter(shortName) {
    return this.particleEmitters.get(shortName);
  }
  play(id) {
    const animation = this.animations.get(id);
    if (!animation)
      throw new Error(`Unknown animation: "${id}"`);
    animation.play();
  }
  pause(id) {
    const animation = this.animations.get(id);
    if (!animation)
      throw new Error(`Unknown animation: "${id}"`);
    animation.pause();
  }
  pauseAll() {
    for (const animation of this.animations.values()) {
      animation.pause();
    }
  }
  tick() {
    for (let bone of this.model.getBoneMap().values()) {
      bone.rotation.set(...bone.userData.defaultRotation);
      bone.position.set(...bone.userData.defaultPosition);
    }
    this.animations.forEach((animation) => animation.shouldTick && animation.tick());
  }
  get shouldTick() {
    return [...this.animations.values()].some((animation) => animation.shouldTick);
  }
  getModel() {
    return this.model;
  }
}
const CubeFaces = [
  {
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
];
const ReduceUvConst = 0.03;
class Cube {
  constructor(cubeConfig) {
    var _a, _b, _c;
    this.positions = [];
    this.indices = [];
    this.normals = [];
    this.uvs = [];
    this.geometry = new BufferGeometry();
    this.group = new Group();
    const {
      textureSize: [tW, tH],
      textureDiscrepancyFactor: [
        textureDiscrepancyW,
        textureDiscrepancyH
      ],
      mirror,
      width,
      height,
      depth
    } = cubeConfig;
    const [realTextureW, realTextureH] = [
      tW * textureDiscrepancyW,
      tH * textureDiscrepancyH
    ];
    const startUV = (_a = cubeConfig.startUV) != null ? _a : [0, 0];
    const usesUVObj = !Array.isArray(startUV);
    let uvX = 0, uvY = 0;
    if (!usesUVObj)
      [uvX, uvY] = startUV;
    for (let {
      name,
      dir,
      corners,
      baseUV: [baseUVX, baseUVY]
    } of CubeFaces) {
      const ndx = this.positions.length / 3;
      let uvSizeX, uvSizeY;
      if (usesUVObj) {
        if (startUV[name] === void 0)
          continue;
        [uvX, uvY] = ((_b = startUV[name]) == null ? void 0 : _b.uv) || [];
        [uvSizeX, uvSizeY] = ((_c = startUV[name]) == null ? void 0 : _c.uv_size) || [];
        uvSizeX *= textureDiscrepancyW;
        uvSizeY *= textureDiscrepancyH;
        uvX *= textureDiscrepancyW;
        uvY *= textureDiscrepancyH;
        baseUVX = 0;
        baseUVY = 0;
      }
      for (const {
        pos: [oX, oY, oZ],
        uv
      } of corners) {
        this.positions.push((mirror ? -oX : oX) * width, oY * height, oZ * depth);
        this.normals.push(...dir);
        this.uvs.push((uvX + (Number(baseUVX > 0) + Number(baseUVX > 2)) * Math.floor(uvSizeX != null ? uvSizeX : depth) + Number(baseUVX > 1) * Math.floor(uvSizeX != null ? uvSizeX : width) + uv[0] * (name === "west" || name === "east" ? Math.floor(uvSizeX != null ? uvSizeX : depth) : Math.floor(uvSizeX != null ? uvSizeX : width)) + (uv[0] === 0 ? ReduceUvConst : -ReduceUvConst)) / (realTextureW / (!usesUVObj ? textureDiscrepancyW : 1)), 1 - (uvY + baseUVY * Math.floor(uvSizeY != null ? uvSizeY : depth) + (name === "up" || name === "down" ? Math.floor(uvSizeY != null ? uvSizeY : depth) : Math.floor(uvSizeY != null ? uvSizeY : height)) - uv[1] * (name === "up" || name === "down" ? Math.floor(uvSizeY != null ? uvSizeY : depth) : Math.floor(uvSizeY != null ? uvSizeY : height)) + (uv[1] === 0 ? -ReduceUvConst : ReduceUvConst)) / (realTextureH / (!usesUVObj ? textureDiscrepancyH : 1)));
      }
      this.indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
    }
    this.createGeometry();
    this.createMesh(cubeConfig);
  }
  createGeometry() {
    this.geometry.setAttribute("position", new BufferAttribute(new Float32Array(this.positions), 3));
    this.geometry.setAttribute("normal", new BufferAttribute(new Float32Array(this.normals), 3));
    this.geometry.setAttribute("uv", new BufferAttribute(new Float32Array(this.uvs), 2));
    this.geometry.setIndex(this.indices);
  }
  createMesh({
    material,
    width,
    height,
    depth,
    pivot,
    rotation,
    origin,
    inflate = 0
  }) {
    const calculatedWidth = inflate * 2 + width;
    const mesh = new Mesh(this.geometry, material);
    this.group.rotation.order = "ZYX";
    if (pivot === void 0)
      pivot = [calculatedWidth / 2, height / 2, depth / 2];
    this.group.add(mesh);
    if (rotation) {
      this.group.position.set(-pivot[0], pivot[1], pivot[2]);
      mesh.position.set(-origin[0] - calculatedWidth / 2 + pivot[0] + inflate, origin[1] - pivot[1] - inflate, origin[2] - pivot[2] - inflate);
      const [rX, rY, rZ] = rotation;
      this.group.rotation.set(MathUtils.degToRad(-rX), MathUtils.degToRad(-rY), MathUtils.degToRad(rZ));
    } else {
      this.group.position.set(-origin[0] - calculatedWidth / 2 + inflate, origin[1] - inflate, origin[2] - inflate);
    }
    if (inflate)
      this.group.scale.set(width !== 0 ? 1 + inflate / (width / 2) : 1, height !== 0 ? 1 + inflate / (height / 2) : 1, depth !== 0 ? 1 + inflate / (depth / 2) : 1);
  }
  getGroup() {
    return this.group;
  }
}
class PolyMesh {
  constructor(polyMeshConfig) {
    var _a, _b, _c, _d, _e, _f, _g;
    this.positions = [];
    this.indices = [];
    this.normals = [];
    this.uvs = [];
    this.geometry = new BufferGeometry();
    this.group = new Group();
    if (!Array.isArray(polyMeshConfig.polys))
      throw new Error("Format not supported yet!");
    if (!polyMeshConfig.normalized_uvs)
      polyMeshConfig.uvs = (_a = polyMeshConfig == null ? void 0 : polyMeshConfig.uvs) == null ? void 0 : _a.map(([uvX, uvY]) => [
        uvX / polyMeshConfig.textureSize[0],
        uvY / polyMeshConfig.textureSize[1]
      ]);
    let i = 0;
    for (const face of polyMeshConfig.polys) {
      for (const [vertexIndex, normalIndex, uvIndex] of face) {
        this.positions.push(...(_c = (_b = polyMeshConfig == null ? void 0 : polyMeshConfig.positions) == null ? void 0 : _b[vertexIndex]) != null ? _c : []);
        this.normals.push(...(_e = (_d = polyMeshConfig == null ? void 0 : polyMeshConfig.normals) == null ? void 0 : _d[normalIndex]) != null ? _e : []);
        this.uvs.push(...(_g = (_f = polyMeshConfig == null ? void 0 : polyMeshConfig.uvs) == null ? void 0 : _f[uvIndex]) != null ? _g : []);
      }
      if (face.length === 3) {
        this.indices.push(i, i + 1, i + 2);
      } else {
        this.indices.push(i + 2, i + 1, i, i + 2, i, i + 3);
      }
      i += face.length;
    }
    this.createGeometry();
    this.createMesh(polyMeshConfig);
  }
  createGeometry() {
    this.geometry.setAttribute("position", new BufferAttribute(new Float32Array(this.positions), 3));
    this.geometry.setAttribute("normal", new BufferAttribute(new Float32Array(this.normals), 3));
    this.geometry.setAttribute("uv", new BufferAttribute(new Float32Array(this.uvs), 2));
    this.geometry.setIndex(this.indices);
  }
  createMesh({ material }) {
    const mesh = new Mesh(this.geometry, material);
    this.group.add(mesh);
  }
  getGroup() {
    return this.group;
  }
}
class Model {
  constructor(modelData, texturePath) {
    var _a, _b;
    this.modelData = modelData;
    this.texturePath = texturePath;
    this.boneMap = new Map();
    this.locators = new Map();
    this.animator = new Animator(this);
    const id = (_b = (_a = modelData == null ? void 0 : modelData.description) == null ? void 0 : _a.identifier) != null ? _b : "geometry.unknown";
    this.model = new Group();
    this.model.name = id;
  }
  async create() {
    var _a, _b, _c, _d, _e, _f;
    const modelData = this.modelData;
    const texture = await this.loadTexture(this.texturePath);
    const textureSize = [
      (_b = (_a = modelData == null ? void 0 : modelData.description) == null ? void 0 : _a.texture_width) != null ? _b : texture.image.width,
      (_d = (_c = modelData == null ? void 0 : modelData.description) == null ? void 0 : _c.texture_height) != null ? _d : texture.image.height
    ];
    const textureDiscrepancyFactor = [
      texture.image.width / textureSize[0],
      texture.image.height / textureSize[1]
    ];
    const boneParentMap = new Map();
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    const modelMaterial = new MeshLambertMaterial({
      side: DoubleSide,
      alphaTest: 0.2,
      transparent: true,
      map: texture
    });
    (_e = modelData == null ? void 0 : modelData.bones) == null ? void 0 : _e.forEach((boneData) => {
      var _a2, _b2, _c2, _d2, _e2, _f2;
      const currBone = new Group();
      currBone.name = (_a2 = boneData.name) != null ? _a2 : "unknown";
      if (boneData.poly_mesh) {
        const polyMeshGroup = new PolyMesh(__spreadProps(__spreadValues({}, boneData.poly_mesh), {
          textureSize,
          material: modelMaterial,
          mirror: (_b2 = boneData.mirror) != null ? _b2 : false,
          origin: [0, 0, 0],
          inflate: boneData.inflate,
          rotation: [0, 0, 0],
          pivot: boneData.pivot
        })).getGroup();
        polyMeshGroup.name = `#bone.${boneData.name}#polyMesh`;
        currBone.add(polyMeshGroup);
      }
      (_c2 = boneData.cubes) == null ? void 0 : _c2.forEach((cubeData, i) => {
        var _a3, _b3, _c3, _d3, _e3, _f3, _g, _h, _i, _j, _k;
        const group = new Cube({
          width: (_b3 = (_a3 = cubeData.size) == null ? void 0 : _a3[0]) != null ? _b3 : 0,
          height: (_d3 = (_c3 = cubeData.size) == null ? void 0 : _c3[1]) != null ? _d3 : 0,
          depth: (_f3 = (_e3 = cubeData.size) == null ? void 0 : _e3[2]) != null ? _f3 : 0,
          startUV: cubeData.uv,
          textureSize,
          textureDiscrepancyFactor,
          material: modelMaterial,
          mirror: cubeData.mirror === void 0 && cubeData.rotation === void 0 ? (_g = boneData.mirror) != null ? _g : false : (_h = cubeData.mirror) != null ? _h : false,
          origin: (_i = cubeData.origin) != null ? _i : [0, 0, 0],
          inflate: (_j = cubeData.inflate) != null ? _j : boneData.inflate,
          rotation: cubeData.rotation,
          pivot: (_k = cubeData.pivot) != null ? _k : boneData.pivot
        }).getGroup();
        group.name = `#bone.${boneData.name}#cube.${i}`;
        currBone.add(group);
      });
      const pivotGroup = new Group();
      pivotGroup.rotation.order = "ZYX";
      if (boneData.pivot) {
        const [pX, pY, pZ] = boneData.pivot;
        pivotGroup.position.set(-pX, pY, pZ);
        currBone.position.set(pX, -pY, -pZ);
      } else {
        pivotGroup.position.set(0, 0, 0);
      }
      pivotGroup.add(currBone);
      pivotGroup.name = `#pivot.${boneData.name}`;
      if (boneData.rotation) {
        const [rX, rY, rZ] = boneData.rotation;
        pivotGroup.rotation.set(MathUtils.degToRad(-rX), MathUtils.degToRad(-rY), MathUtils.degToRad(rZ));
      }
      const locators = (_d2 = boneData.locators) != null ? _d2 : {};
      for (const locatorName in locators) {
        const locator = new Group();
        locator.name = `locator#${locatorName}`;
        const locData = locators[locatorName];
        if (Array.isArray(locData)) {
          locator.position.set(...locData);
        } else if (typeof locData === "object") {
          locator.position.set(...(_e2 = locData.offset) != null ? _e2 : [0, 0, 0]);
          locator.rotation.set(...(_f2 = locData.rotation) != null ? _f2 : [0, 0, 0]);
        }
        this.locators.set(locatorName, locator);
        pivotGroup.add(locator);
      }
      if (!boneData.parent)
        this.model.add(pivotGroup);
      if (boneData.name) {
        boneParentMap.set(boneData.name, [boneData.parent, pivotGroup]);
        this.boneMap.set(boneData.name, pivotGroup);
      }
    });
    for (let [_, [parent, bone]] of boneParentMap)
      if (parent) {
        const parentGroup = (_f = boneParentMap.get(parent)) == null ? void 0 : _f[1];
        if (parentGroup && parentGroup.name.startsWith("#pivot."))
          parentGroup.children[0].add(bone);
        else if (parentGroup)
          parentGroup.add(bone);
      }
    this.animator.setupDefaultBonePoses();
  }
  getGroup() {
    return this.model;
  }
  getBoneMap() {
    return this.boneMap;
  }
  getLocator(name) {
    return this.locators.get(name);
  }
  tick() {
    this.animator.tick();
  }
  get shouldTick() {
    return this.animator.shouldTick;
  }
  createOutlineBox(color, position, size) {
    const outlineMaterial = new LineBasicMaterial({
      side: DoubleSide,
      color,
      linewidth: 20
    });
    const cube = new BoxGeometry(size.x, size.y, size.z);
    const edges = new EdgesGeometry(cube);
    const mesh = new LineSegments(edges, outlineMaterial);
    mesh.position.set(position.x, position.y + size.y / 2, position.z);
    mesh.name = "helperBox";
    this.model.add(mesh);
    return {
      dispose: () => {
        this.model.remove(mesh);
      }
    };
  }
  hideBone(name) {
    const bone = this.boneMap.get(name);
    if (bone)
      bone.visible = false;
  }
  showBone(name) {
    const bone = this.boneMap.get(name);
    if (bone)
      bone.visible = true;
  }
  get bones() {
    return [...this.boneMap.keys()];
  }
  dispose() {
    this.animator.dispose();
  }
  loadTexture(url) {
    return new Promise((resolve, reject) => {
      const loader = new TextureLoader();
      loader.load(url, (texture) => {
        resolve(texture);
      });
    });
  }
}
class StandaloneModelViewer {
  constructor(canvasElement, modelData, texturePath, options) {
    var _a;
    this.canvasElement = canvasElement;
    this.texturePath = texturePath;
    this.options = options;
    this.renderingRequested = false;
    this.renderer = new WebGLRenderer({
      canvas: canvasElement,
      antialias: (_a = options.antialias) != null ? _a : false
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new PerspectiveCamera(70, 2, 0.1, 1e3);
    this.camera.position.x = -20;
    this.camera.position.y = 20;
    this.camera.position.z = -20;
    this.camera.updateProjectionMatrix();
    this.controls = new OrbitControls(this.camera, canvasElement);
    this.scene = new Scene();
    this.scene.add(new AmbientLight(16777215));
    this.scene.background = new Color(13299960);
    this.model = new Model(modelData, texturePath);
    this.scene.add(this.model.getGroup());
    window.addEventListener("resize", this.onResize.bind(this));
    this.controls.addEventListener("change", () => this.requestRendering());
    this.onResize();
    this.loadedModel = this.loadModel().then(() => this.requestRendering());
  }
  async loadModel() {
    await this.model.create();
  }
  get width() {
    var _a;
    return (_a = this.options.width) != null ? _a : window.innerWidth;
  }
  get height() {
    var _a;
    return (_a = this.options.height) != null ? _a : window.innerHeight;
  }
  render(checkShouldTick = true) {
    var _a;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.renderingRequested = false;
    if (checkShouldTick && this.model.shouldTick) {
      this.model.tick();
      (_a = this.model.animator.winterskyScene) == null ? void 0 : _a.updateFacingRotation(this.camera);
      this.requestRendering();
    }
  }
  requestRendering(immediate = false) {
    if (immediate)
      return this.render(false);
    if (this.renderingRequested)
      return;
    this.renderingRequested = true;
    requestAnimationFrame(() => this.render());
  }
  onResize() {
    this.renderer.setSize(this.width, this.height, true);
    this.camera.aspect = this.width / this.height;
    this.positionCamera();
    this.requestRendering();
  }
  dispose() {
    window.removeEventListener("resize", this.onResize);
    this.controls.removeEventListener("change", this.requestRendering);
  }
  addHelpers() {
    this.scene.add(new AxesHelper(50));
    this.scene.add(new GridHelper(20, 20));
    this.scene.add(new BoxHelper(this.model.getGroup(), 16776960));
    this.requestRendering();
  }
  getModel() {
    return this.model;
  }
  positionCamera(scale = 1.5, rotate = true) {
    if (rotate)
      this.model.getGroup().rotation.set(0, Math.PI, 0);
    const boundingSphere = new Box3().setFromObject(this.model.getGroup()).getBoundingSphere(new Sphere());
    const objectAngularSize = this.camera.fov * Math.PI / 180 * scale;
    const distanceToCamera = boundingSphere.radius / Math.tan(objectAngularSize / 2);
    const len = Math.sqrt(Math.pow(distanceToCamera, 2) + Math.pow(distanceToCamera, 2));
    this.camera.position.set(len, len, len);
    this.controls.update();
    this.camera.lookAt(boundingSphere.center);
    this.controls.target.set(boundingSphere.center.x, boundingSphere.center.y, boundingSphere.center.z);
    this.camera.updateProjectionMatrix();
  }
}
export { Model, StandaloneModelViewer };
