"use strict";(self.webpackChunkatlas_payments_ui=self.webpackChunkatlas_payments_ui||[]).push([[358,949],{8949:function(e,t,n){n.r(t),n.d(t,{IGNORE_CLASS_NAME:function(){return h}});var o=n(6985),i=n(563);function r(e,t){return r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},r(e,t)}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function c(e,t,n){return e===t||(e.correspondingElement?e.correspondingElement.classList.contains(n):e.classList.contains(n))}var u,d,a=(void 0===u&&(u=0),function(){return++u}),l={},p={},f=["touchstart","touchmove"],h="ignore-react-onclickoutside";function m(e,t){var n=null;return-1!==f.indexOf(t)&&d&&(n={passive:!e.props.preventDefault}),n}t.default=function(e,t){var n,u,f=e.displayName||e.name||"Component";return u=n=function(n){var u,h;function v(e){var o;return(o=n.call(this,e)||this).__outsideClickHandler=function(e){if("function"!=typeof o.__clickOutsideHandlerProp){var t=o.getInstance();if("function"!=typeof t.props.handleClickOutside){if("function"!=typeof t.handleClickOutside)throw new Error("WrappedComponent: "+f+" lacks a handleClickOutside(event) function for processing outside click events.");t.handleClickOutside(e)}else t.props.handleClickOutside(e)}else o.__clickOutsideHandlerProp(e)},o.__getComponentNode=function(){var e=o.getInstance();return t&&"function"==typeof t.setClickOutsideRef?t.setClickOutsideRef()(e):"function"==typeof e.setClickOutsideRef?e.setClickOutsideRef():(0,i.findDOMNode)(e)},o.enableOnClickOutside=function(){if("undefined"!=typeof document&&!p[o._uid]){void 0===d&&(d=function(){if("undefined"!=typeof window&&"function"==typeof window.addEventListener){var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}}),n=function(){};return window.addEventListener("testPassiveEventSupport",n,t),window.removeEventListener("testPassiveEventSupport",n,t),e}}()),p[o._uid]=!0;var e=o.props.eventTypes;e.forEach||(e=[e]),l[o._uid]=function(e){var t;null!==o.componentNode&&(o.props.preventDefault&&e.preventDefault(),o.props.stopPropagation&&e.stopPropagation(),o.props.excludeScrollbar&&(t=e,document.documentElement.clientWidth<=t.clientX||document.documentElement.clientHeight<=t.clientY)||function(e,t,n){if(e===t)return!0;for(;e.parentNode||e.host;){if(e.parentNode&&c(e,t,n))return!0;e=e.parentNode||e.host}return e}(e.composed&&e.composedPath&&e.composedPath().shift()||e.target,o.componentNode,o.props.outsideClickIgnoreClass)===document&&o.__outsideClickHandler(e))},e.forEach((function(e){document.addEventListener(e,l[o._uid],m(s(o),e))}))}},o.disableOnClickOutside=function(){delete p[o._uid];var e=l[o._uid];if(e&&"undefined"!=typeof document){var t=o.props.eventTypes;t.forEach||(t=[t]),t.forEach((function(t){return document.removeEventListener(t,e,m(s(o),t))})),delete l[o._uid]}},o.getRef=function(e){return o.instanceRef=e},o._uid=a(),o}h=n,(u=v).prototype=Object.create(h.prototype),u.prototype.constructor=u,r(u,h);var O=v.prototype;return O.getInstance=function(){if(e.prototype&&!e.prototype.isReactComponent)return this;var t=this.instanceRef;return t.getInstance?t.getInstance():t},O.componentDidMount=function(){if("undefined"!=typeof document&&document.createElement){var e=this.getInstance();if(t&&"function"==typeof t.handleClickOutside&&(this.__clickOutsideHandlerProp=t.handleClickOutside(e),"function"!=typeof this.__clickOutsideHandlerProp))throw new Error("WrappedComponent: "+f+" lacks a function for processing outside click events specified by the handleClickOutside config option.");this.componentNode=this.__getComponentNode(),this.props.disableOnClickOutside||this.enableOnClickOutside()}},O.componentDidUpdate=function(){this.componentNode=this.__getComponentNode()},O.componentWillUnmount=function(){this.disableOnClickOutside()},O.render=function(){var t=this.props;t.excludeScrollbar;var n=function(e,t){if(null==e)return{};var n,o,i={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(i[n]=e[n]);return i}(t,["excludeScrollbar"]);return e.prototype&&e.prototype.isReactComponent?n.ref=this.getRef:n.wrappedRef=this.getRef,n.disableOnClickOutside=this.disableOnClickOutside,n.enableOnClickOutside=this.enableOnClickOutside,(0,o.createElement)(e,n)},v}(o.Component),n.displayName="OnClickOutside("+f+")",n.defaultProps={eventTypes:["mousedown","touchstart"],excludeScrollbar:t&&t.excludeScrollbar||!1,outsideClickIgnoreClass:h,preventDefault:!1,stopPropagation:!1},n.getClass=function(){return e.getClass?e.getClass():e},u}}}]);
//# sourceMappingURL=358.bundle.js.map