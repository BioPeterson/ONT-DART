(function(t){function e(e){for(var o,a,l=e[0],c=e[1],s=e[2],u=0,f=[];u<l.length;u++)a=l[u],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&f.push(r[a][0]),r[a]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(t[o]=c[o]);d&&d(e);while(f.length)f.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],o=!0,a=1;a<n.length;a++){var l=n[a];0!==r[l]&&(o=!1)}o&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var o={},a={app:0},r={app:0},i=[];function l(t){return c.p+"js/"+({}[t]||t)+"."+{"chunk-24f7c388":"29479652","chunk-5f7b624e":"af60a628","chunk-f36ecf2c":"a39fc66f"}[t]+".js"}function c(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(t){var e=[],n={"chunk-24f7c388":1,"chunk-5f7b624e":1,"chunk-f36ecf2c":1};a[t]?e.push(a[t]):0!==a[t]&&n[t]&&e.push(a[t]=new Promise((function(e,n){for(var o="css/"+({}[t]||t)+"."+{"chunk-24f7c388":"5730b2e9","chunk-5f7b624e":"6d086cf1","chunk-f36ecf2c":"65efbb9b"}[t]+".css",r=c.p+o,i=document.getElementsByTagName("link"),l=0;l<i.length;l++){var s=i[l],u=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(u===o||u===r))return e()}var f=document.getElementsByTagName("style");for(l=0;l<f.length;l++){s=f[l],u=s.getAttribute("data-href");if(u===o||u===r)return e()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=e,d.onerror=function(e){var o=e&&e.target&&e.target.src||r,i=new Error("Loading CSS chunk "+t+" failed.\n("+o+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=o,delete a[t],d.parentNode.removeChild(d),n(i)},d.href=r;var p=document.getElementsByTagName("head")[0];p.appendChild(d)})).then((function(){a[t]=0})));var o=r[t];if(0!==o)if(o)e.push(o[2]);else{var i=new Promise((function(e,n){o=r[t]=[e,n]}));e.push(o[2]=i);var s,u=document.createElement("script");u.charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.src=l(t);var f=new Error;s=function(e){u.onerror=u.onload=null,clearTimeout(d);var n=r[t];if(0!==n){if(n){var o=e&&("load"===e.type?"missing":e.type),a=e&&e.target&&e.target.src;f.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",f.name="ChunkLoadError",f.type=o,f.request=a,n[1](f)}r[t]=void 0}};var d=setTimeout((function(){s({type:"timeout",target:u})}),12e4);u.onerror=u.onload=s,document.head.appendChild(u)}return Promise.all(e)},c.m=t,c.c=o,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)c.d(n,o,function(e){return t[e]}.bind(null,o));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/",c.oe=function(t){throw console.error(t),t};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=e,s=s.slice();for(var f=0;f<s.length;f++)e(s[f]);var d=u;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},4360:function(t,e,n){"use strict";n("e9c4");var o={state:{org:{data:[]},plot:{data:[]},ntc:{data:[]},log:{data:""}},setOrgDataAction:function(t){JSON.stringify(this.state.org.data)!==JSON.stringify(t)&&(this.state.org.data=t)},setPlotDataAction:function(t){JSON.stringify(this.state.plot.data)!==JSON.stringify(t)&&(this.state.plot.data=t)},setNtcDataAction:function(t){JSON.stringify(this.state.ntc.data)!==JSON.stringify(t)&&(this.state.ntc.data=t)},setLogDataAction:function(t){this.state.log.data=t}};e["a"]=o},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("2b0e"),a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-app",[o("v-app-bar",{attrs:{app:"",color:"primary"}},[o("v-img",{staticClass:"mx-2",attrs:{src:n("d939"),"max-height":"40","max-width":"40",contain:""}}),o("v-toolbar-title",[o("span",{staticStyle:{color:"white"}},[t._v("ONT-DART")])]),o("v-spacer"),t._l(t.navItems,(function(e){return o("v-btn",{key:e.title,attrs:{to:e.link,text:"",tile:"",color:"white"}},[o("v-icon",{attrs:{left:""}},[t._v(" "+t._s(e.icon)+" ")]),t._v(" "+t._s(e.title)+" ")],1)}))],2),o("v-main",[o("v-container",[o("router-view")],1)],1)],1)},r=[],i=(n("d3b7"),n("4360")),l=n("917a"),c={name:"App",data:function(){return{drawer:!1,navItems:[{title:"Home",icon:"mdi-home",link:"/"},{title:"Analysis",icon:"mdi-test-tube",link:"/analysis"},{title:"Results",icon:"mdi-file-chart",link:"/results"}],logTimeout:null,plotTimeout:null,orgTimeout:null,ntcTimeout:null}},mounted:function(){this.pollLog(),this.pollPlot(),this.pollOrg(),this.pollNtc()},unmounted:function(){clearTimeout(this.logTimeout),clearTimeout(this.plotTimeout),clearTimeout(this.orgTimeout),clearTimeout(this.ntcTimeout)},methods:{pollLog:function(){var t=this;l["a"].getLog().then((function(t){return i["a"].setLogDataAction(t.data.content)})).finally((function(){t.logTimeout=setTimeout(t.pollLog,2e3)}))},pollPlot:function(){var t=this;l["a"].getPlot().then((function(t){return i["a"].setPlotDataAction(t.data)})).finally((function(){t.plotTimeout=setTimeout(t.pollPlot,2e3)}))},pollOrg:function(){var t=this;l["a"].getOrg().then((function(t){return i["a"].setOrgDataAction(t.data)})).finally((function(){t.orgTimeout=setTimeout(t.pollOrg,2e3)}))},pollNtc:function(){var t=this;l["a"].getNtc().then((function(t){return i["a"].setNtcDataAction(t.data)})).finally((function(){t.ntcTimeout=setTimeout(t.pollNtc,2e3)}))}}},s=c,u=n("2877"),f=n("6544"),d=n.n(f),p=n("7496"),h=n("40dc"),v=n("8336"),m=n("a523"),g=n("132d"),y=n("adda"),b=n("f6c4"),T=n("2fa4"),O=n("2a7f"),_=Object(u["a"])(s,a,r,!1,null,null,null),w=_.exports;d()(_,{VApp:p["a"],VAppBar:h["a"],VBtn:v["a"],VContainer:m["a"],VIcon:g["a"],VImg:y["a"],VMain:b["a"],VSpacer:T["a"],VToolbarTitle:O["a"]});var k=n("f309");o["a"].use(k["a"]);var N=new k["a"]({theme:{themes:{light:{primary:"#3F51B5",secondary:"#9FA8DA"}}}}),x=(n("3ca3"),n("ddb0"),n("8c4f")),A=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("v-row",[n("v-col",{attrs:{align:"center"}},[n("div",{staticClass:"text-h1"},[t._v("ONT-DART")]),n("div",{staticClass:"text-subtitle-2"},[n("u",[t._v("Oxford Nanopore Technologies")]),t._v(" "),n("u",[t._v("D")]),t._v("etection of "),n("u",[t._v("A")]),t._v("mplicons in "),n("u",[t._v("R")]),t._v("eal-"),n("u",[t._v("T")]),t._v("ime ")])])],1),n("v-row",[n("v-col",[n("div",{staticClass:"text-body-1"},[t._v(" The ONT-DART (Oxford Nanopore Technologies Detection of Amplicons in Real-Time) analysis pipeline is used to identify the presence of amplicons produced from a multiplex PCR reaction from sequence read output of an Oxford Nanopore Technologies (ONT) sequencing device (e.g. MK1B, MK1C, or GridION). If all amplicon products from a particular organism are above the algorithm's three detection thresholds, the organism is flagged as present in the sample. ")])])],1),n("v-row",[n("v-col",[n("div",{staticClass:"text-body-1"},[t._v(" R9 or FLG flowcells are expected to have been used for sequencing the pooled barcoded library (one sample per barcode), using the Native Barcoding kit, and MinKNOW software utilized for experiment setup, basecalling, and demultiplexing of sequence reads. ")])])],1),n("v-row",[n("v-col",[n("div",{staticClass:"text-body-1"},[t._v(" Positive detection thresholds occur in the following order: ")])])],1),n("v-row",[n("v-col",[n("div",{staticClass:"text-body-2"},[t._v(" T1. per read alignment thresholds (>=90% alignment identity and length) ")])]),n("v-col",[n("div",{staticClass:"text-body-2"},[t._v(" T2. per sample threshold (>2% total aligned read count) ")])]),n("v-col",[n("div",{staticClass:"text-body-2"},[t._v(" T3. per flow cell threshold (based on NTCs, amplicon called negative if the sample count < {[mean NTC counts] + [3*NTC count standard deviation]}) ")])])],1),n("v-row",[n("v-col",{attrs:{align:"center"}},[n("v-btn",{attrs:{block:"",outlined:"",color:"primary",to:"/analysis"}},[t._v(" Go to Analysis ")])],1)],1)],1)},C=[],P={name:"Home"},S=P,D=n("62ad"),j=n("0fd9"),L=Object(u["a"])(S,A,C,!1,null,null,null),V=L.exports;d()(L,{VBtn:v["a"],VCol:D["a"],VRow:j["a"]}),o["a"].use(x["a"]);var E=[{path:"/",name:"Home",component:V},{path:"/analysis",name:"Analysis",component:function(){return Promise.all([n.e("chunk-24f7c388"),n.e("chunk-f36ecf2c")]).then(n.bind(null,"9aef"))}},{path:"/results",name:"Results",component:function(){return Promise.all([n.e("chunk-24f7c388"),n.e("chunk-5f7b624e")]).then(n.bind(null,"b3c3"))}}],R=new x["a"]({base:"/",routes:E}),B=R;o["a"].config.productionTip=!1,new o["a"]({vuetify:N,router:B,render:function(t){return t(w)}}).$mount("#app")},"917a":function(t,e,n){"use strict";var o=n("d4ec"),a=n("bee2"),r=n("bc3a"),i=n.n(r),l="/api/analysis",c=function(){function t(){Object(o["a"])(this,t)}return Object(a["a"])(t,[{key:"startAnalysis",value:function(t){return i.a.post(l,t)}},{key:"stopAnalysis",value:function(){return i.a.delete(l)}},{key:"getLog",value:function(){return i.a.get("".concat(l,"/log"))}},{key:"getPlot",value:function(){return i.a.get("".concat(l,"/plot"))}},{key:"getOrg",value:function(){return i.a.get("".concat(l,"/org"))}},{key:"getNtc",value:function(){return i.a.get("".concat(l,"/ntc"))}}]),t}();e["a"]=new c},d939:function(t,e,n){t.exports=n.p+"img/logo-white.293bcba7.png"}});
//# sourceMappingURL=app.8aa38f8c.js.map