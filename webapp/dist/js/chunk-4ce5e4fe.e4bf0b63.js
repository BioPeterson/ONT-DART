(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4ce5e4fe"],{"0c18":function(t,e,i){},"159c":function(t,e,i){},"5d11":function(t,e,i){},9734:function(t,e,i){},"9aef":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("v-row",[i("v-col",[i("v-alert",{attrs:{dismissible:"",outlined:"",type:t.responseType,transition:"slide-y-transition"},model:{value:t.alert,callback:function(e){t.alert=e},expression:"alert"}},[t._v(" "+t._s(t.responseMessage)+" ")])],1)],1),i("v-row",[i("v-col",{attrs:{cols:"6"}},[i("analysis-form",{ref:"analysisForm",attrs:{height:t.height},on:{response:t.handleResponse}})],1),i("v-col",{attrs:{cols:"6"}},[i("analysis-log",{attrs:{height:t.height}})],1)],1),i("v-row",[i("v-col",{attrs:{align:"center"}},[t.plot.data.length>0&&t.org.data.length>0?i("v-btn",{attrs:{block:"",outlined:"",color:"primary",to:"/results"}},[t._v(" View Analysis Results ")]):t._e()],1)],1)],1)},n=[],r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-card",{staticClass:"d-flex flex-column",attrs:{height:t.height}},[i("v-card-title",[t._v("Analysis Form")]),i("v-card-text",[i("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"Input Directory",type:"text",rules:[t.rules.required],required:""},model:{value:t.inputDirectory,callback:function(e){t.inputDirectory=e},expression:"inputDirectory"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" The input directory must be the full path to the 'fastq_pass' subfolder of an ONT sequencing run, and have sub-folders named for each demultiplexed (demux) barcode (this is default for demux by MinKNOW). Currently, sub-folder names are expected to be from 'barcode01' to 'barcode12'. ")])]),i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"NTC Barcodes",type:"text",rules:[t.rules.required],required:""},model:{value:t.barcodes,callback:function(e){t.barcodes=e},expression:"barcodes"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" Additionally, one of the 12 barcodes is reserved for a NTC (nontemplate control). This is used for the final threshold for calling a positive amplicon (T3). ")])]),i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"Analysis Interval (in seconds)",type:"number",rules:[t.rules.required],required:""},model:{value:t.analysisInterval,callback:function(e){t.analysisInterval=e},expression:"analysisInterval"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" The analysis interval is set to running the analysis on the input directory every 60 seconds. A maximum of 10 minutes is set internally, and will override any value larger than 600. This is to keep analysis processing time within a reasonable range. Note that reads processed in the previous interval are not processed in the next, and their counts are carried over to the latest results files. ")])]),i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"Number of Threads",type:"number",rules:[t.rules.required],required:""},model:{value:t.threads,callback:function(e){t.threads=e},expression:"threads"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" The default thread count is set to 1, and should only be increased if you know your system well. It is recommended that if sequencing, basecalling, and demultiplexing are running concurrently with this application, that the thread count be set no greater than half the total threads available on the system. ")])])],1)],1),i("v-spacer"),i("v-card-actions",[i("v-btn",{attrs:{color:"primary",disabled:!t.valid},on:{click:t.startAnalysis}},[t._v(" Start ")]),i("v-btn",{attrs:{color:"secondary"},on:{click:t.stopAnalysis}},[t._v(" Stop ")])],1)],1)},a=[],o=(i("498a"),i("917a")),l={name:"AnalysisForm",props:{height:String},data:function(){return{valid:!0,inputDirectory:"/app/DATA/fastq_pass/",barcodes:"barcode10,barcode11,barcode12",analysisInterval:"10",threads:"1",rules:{required:function(t){return!!t&&""!==t.trim()||"This field is required"}}}},methods:{startAnalysis:function(){if(this.$refs.form.validate()){var t={inputDirectory:this.inputDirectory,barcodeList:this.barcodes,analysisInterval:this.analysisInterval,numThreads:this.threads};o["a"].startAnalysis(t).then(this.handleSuccess).catch(this.handleError)}},stopAnalysis:function(){o["a"].stopAnalysis().then(this.handleSuccess).catch(this.handleError)},handleSuccess:function(t){var e=t.data;this.$emit("response",{message:e.message,type:"success"})},handleError:function(t){var e=t.response,i=500!==e.status?e.data.message:"An error occurred with the server.";this.$emit("response",{message:i,type:"error"})}}},c=l,u=(i("a91e"),i("2877")),h=i("6544"),d=i.n(h),p=i("8336"),f=i("b0af"),v=i("99d9"),m=i("5530"),g=(i("caad"),i("2532"),i("07ac"),i("4de4"),i("d3b7"),i("159b"),i("7db0"),i("58df")),b=i("7e2b"),y=i("3206"),_=Object(g["a"])(b["a"],Object(y["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var e=Object.values(t).includes(!0);this.$emit("input",!e)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var e=this,i=function(t){return t.$watch("hasError",(function(i){e.$set(e.errorBag,t._uid,i)}),{immediate:!0})},s={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?s.shouldValidate=t.$watch("shouldValidate",(function(n){n&&(e.errorBag.hasOwnProperty(t._uid)||(s.valid=i(t)))})):s.valid=i(t),s},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var e=this.inputs.find((function(e){return e._uid===t._uid}));if(e){var i=this.watchers.find((function(t){return t._uid===e._uid}));i&&(i.valid(),i.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==e._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==e._uid})),this.$delete(this.errorBag,e._uid)}}},render:function(t){var e=this;return t("form",{staticClass:"v-form",attrs:Object(m["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return e.$emit("submit",t)}}},this.$slots.default)}}),x=i("2fa4"),A=i("8654"),C=i("ade3"),w=(i("a9e3"),i("9734"),i("4ad4")),B=i("a9ad"),T=i("16b7"),$=i("b848"),O=i("f573"),S=i("f2e7"),I=i("80d2"),k=i("d9bd"),V=Object(g["a"])(B["a"],T["a"],$["a"],O["a"],S["a"]).extend({name:"v-tooltip",props:{closeDelay:{type:[Number,String],default:0},disabled:Boolean,openDelay:{type:[Number,String],default:0},openOnHover:{type:Boolean,default:!0},openOnFocus:{type:Boolean,default:!0},tag:{type:String,default:"span"},transition:String},data:function(){return{calculatedMinWidth:0,closeDependents:!1}},computed:{calculatedLeft:function(){var t=this.dimensions,e=t.activator,i=t.content,s=!this.bottom&&!this.left&&!this.top&&!this.right,n=!1!==this.attach?e.offsetLeft:e.left,r=0;return this.top||this.bottom||s?r=n+e.width/2-i.width/2:(this.left||this.right)&&(r=n+(this.right?e.width:-i.width)+(this.right?10:-10)),this.nudgeLeft&&(r-=parseInt(this.nudgeLeft)),this.nudgeRight&&(r+=parseInt(this.nudgeRight)),"".concat(this.calcXOverflow(r,this.dimensions.content.width),"px")},calculatedTop:function(){var t=this.dimensions,e=t.activator,i=t.content,s=!1!==this.attach?e.offsetTop:e.top,n=0;return this.top||this.bottom?n=s+(this.bottom?e.height:-i.height)+(this.bottom?10:-10):(this.left||this.right)&&(n=s+e.height/2-i.height/2),this.nudgeTop&&(n-=parseInt(this.nudgeTop)),this.nudgeBottom&&(n+=parseInt(this.nudgeBottom)),!1===this.attach&&(n+=this.pageYOffset),"".concat(this.calcYOverflow(n),"px")},classes:function(){return{"v-tooltip--top":this.top,"v-tooltip--right":this.right,"v-tooltip--bottom":this.bottom,"v-tooltip--left":this.left,"v-tooltip--attached":""===this.attach||!0===this.attach||"attach"===this.attach}},computedTransition:function(){return this.transition?this.transition:this.isActive?"scale-transition":"fade-transition"},offsetY:function(){return this.top||this.bottom},offsetX:function(){return this.left||this.right},styles:function(){return{left:this.calculatedLeft,maxWidth:Object(I["e"])(this.maxWidth),minWidth:Object(I["e"])(this.minWidth),top:this.calculatedTop,zIndex:this.zIndex||this.activeZIndex}}},beforeMount:function(){var t=this;this.$nextTick((function(){t.value&&t.callActivate()}))},mounted:function(){"v-slot"===Object(I["q"])(this,"activator",!0)&&Object(k["b"])("v-tooltip's activator slot must be bound, try '<template #activator=\"data\"><v-btn v-on=\"data.on>'",this)},methods:{activate:function(){this.updateDimensions(),requestAnimationFrame(this.startTransition)},deactivate:function(){this.runDelay("close")},genActivatorListeners:function(){var t=this,e=w["a"].options.methods.genActivatorListeners.call(this);return this.openOnFocus&&(e.focus=function(e){t.getActivator(e),t.runDelay("open")},e.blur=function(e){t.getActivator(e),t.runDelay("close")}),e.keydown=function(e){e.keyCode===I["u"].esc&&(t.getActivator(e),t.runDelay("close"))},e},genActivatorAttributes:function(){return{"aria-haspopup":!0,"aria-expanded":String(this.isActive)}},genTransition:function(){var t=this.genContent();return this.computedTransition?this.$createElement("transition",{props:{name:this.computedTransition}},[t]):t},genContent:function(){var t;return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-tooltip__content",class:(t={},Object(C["a"])(t,this.contentClass,!0),Object(C["a"])(t,"menuable__content__active",this.isActive),Object(C["a"])(t,"v-tooltip__content--fixed",this.activatorFixed),t),style:this.styles,attrs:this.getScopeIdAttrs(),directives:[{name:"show",value:this.isContentActive}],ref:"content"}),this.getContentSlot())}},render:function(t){var e=this;return t(this.tag,{staticClass:"v-tooltip",class:this.classes},[this.showLazyContent((function(){return[e.genTransition()]})),this.genActivator()])}}),E=Object(u["a"])(c,r,a,!1,null,"b2aea786",null),j=E.exports;d()(E,{VBtn:p["a"],VCard:f["a"],VCardActions:v["a"],VCardText:v["b"],VCardTitle:v["c"],VForm:_,VSpacer:x["a"],VTextField:A["a"],VTooltip:V});var D=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-card",{attrs:{height:t.height}},[i("v-card-title",[t._v("Analysis Log")]),i("v-card-text",[i("div",{staticClass:"text-body-2"},[t._v(t._s(t.log.data))])])],1)},q=[],L=i("4360"),F={name:"AnalysisLog",props:{height:String},data:function(){return{log:L["a"].state.log}}},N=F,W=(i("eca5"),Object(u["a"])(N,D,q,!1,null,"535510d3",null)),z=W.exports;d()(W,{VCard:f["a"],VCardText:v["b"],VCardTitle:v["c"]});var M={name:"Analysis",components:{AnalysisForm:j,AnalysisLog:z},data:function(){return{alert:!1,height:"450px",responseType:"success",responseMessage:"",plot:L["a"].state.plot,org:L["a"].state.org}},methods:{handleResponse:function(t){this.responseType=t.type,this.responseMessage=t.message,this.alert=!0}}},R=M,Y=(i("0c18"),i("10d2")),J=i("afdd"),P=i("9d26"),X=i("7560"),H=i("2b0e"),K=H["a"].extend({name:"transitionable",props:{mode:String,origin:String,transition:String}}),Z=Object(g["a"])(Y["a"],S["a"],K).extend({name:"v-alert",props:{border:{type:String,validator:function(t){return["top","right","bottom","left"].includes(t)}},closeLabel:{type:String,default:"$vuetify.close"},coloredBorder:Boolean,dense:Boolean,dismissible:Boolean,closeIcon:{type:String,default:"$cancel"},icon:{default:"",type:[Boolean,String],validator:function(t){return"string"===typeof t||!1===t}},outlined:Boolean,prominent:Boolean,text:Boolean,type:{type:String,validator:function(t){return["info","error","success","warning"].includes(t)}},value:{type:Boolean,default:!0}},computed:{__cachedBorder:function(){if(!this.border)return null;var t={staticClass:"v-alert__border",class:Object(C["a"])({},"v-alert__border--".concat(this.border),!0)};return this.coloredBorder&&(t=this.setBackgroundColor(this.computedColor,t),t.class["v-alert__border--has-color"]=!0),this.$createElement("div",t)},__cachedDismissible:function(){var t=this;if(!this.dismissible)return null;var e=this.iconColor;return this.$createElement(J["a"],{staticClass:"v-alert__dismissible",props:{color:e,icon:!0,small:!0},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:function(){return t.isActive=!1}}},[this.$createElement(P["a"],{props:{color:e}},this.closeIcon)])},__cachedIcon:function(){return this.computedIcon?this.$createElement(P["a"],{staticClass:"v-alert__icon",props:{color:this.iconColor}},this.computedIcon):null},classes:function(){var t=Object(m["a"])(Object(m["a"])({},Y["a"].options.computed.classes.call(this)),{},{"v-alert--border":Boolean(this.border),"v-alert--dense":this.dense,"v-alert--outlined":this.outlined,"v-alert--prominent":this.prominent,"v-alert--text":this.text});return this.border&&(t["v-alert--border-".concat(this.border)]=!0),t},computedColor:function(){return this.color||this.type},computedIcon:function(){return!1!==this.icon&&("string"===typeof this.icon&&this.icon?this.icon:!!["error","info","success","warning"].includes(this.type)&&"$".concat(this.type))},hasColoredIcon:function(){return this.hasText||Boolean(this.border)&&this.coloredBorder},hasText:function(){return this.text||this.outlined},iconColor:function(){return this.hasColoredIcon?this.computedColor:void 0},isDark:function(){return!(!this.type||this.coloredBorder||this.outlined)||X["a"].options.computed.isDark.call(this)}},created:function(){this.$attrs.hasOwnProperty("outline")&&Object(k["a"])("outline","outlined",this)},methods:{genWrapper:function(){var t=[this.$slots.prepend||this.__cachedIcon,this.genContent(),this.__cachedBorder,this.$slots.append,this.$scopedSlots.close?this.$scopedSlots.close({toggle:this.toggle}):this.__cachedDismissible],e={staticClass:"v-alert__wrapper"};return this.$createElement("div",e,t)},genContent:function(){return this.$createElement("div",{staticClass:"v-alert__content"},this.$slots.default)},genAlert:function(){var t={staticClass:"v-alert",attrs:{role:"alert"},on:this.listeners$,class:this.classes,style:this.styles,directives:[{name:"show",value:this.isActive}]};if(!this.coloredBorder){var e=this.hasText?this.setTextColor:this.setBackgroundColor;t=e(this.computedColor,t)}return this.$createElement("div",t,[this.genWrapper()])},toggle:function(){this.isActive=!this.isActive}},render:function(t){var e=this.genAlert();return this.transition?t("transition",{props:{name:this.transition,origin:this.origin,mode:this.mode}},[e]):e}}),G=i("62ad"),Q=i("0fd9"),U=Object(u["a"])(R,s,n,!1,null,null,null);e["default"]=U.exports;d()(U,{VAlert:Z,VBtn:p["a"],VCol:G["a"],VRow:Q["a"]})},a91e:function(t,e,i){"use strict";i("5d11")},eca5:function(t,e,i){"use strict";i("159c")}}]);
//# sourceMappingURL=chunk-4ce5e4fe.e4bf0b63.js.map