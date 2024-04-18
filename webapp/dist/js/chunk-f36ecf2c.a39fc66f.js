(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f36ecf2c"],{"07b0":function(t,e,i){},"0c18":function(t,e,i){},"159c":function(t,e,i){},9734:function(t,e,i){},"9aef":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("v-row",[i("v-col",[i("v-alert",{attrs:{dismissible:"",outlined:"",type:t.responseType,transition:"slide-y-transition"},model:{value:t.alert,callback:function(e){t.alert=e},expression:"alert"}},[t._v(" "+t._s(t.responseMessage)+" ")])],1)],1),i("v-row",[i("v-col",{attrs:{cols:"6"}},[i("analysis-form",{ref:"analysisForm",attrs:{height:t.height},on:{response:t.handleResponse}})],1),i("v-col",{attrs:{cols:"6"}},[i("analysis-log",{attrs:{height:t.height}})],1)],1),i("v-row",[i("v-col",{attrs:{align:"center"}},[t.plot.data.length>0&&t.org.data.length>0?i("v-btn",{attrs:{block:"",outlined:"",color:"primary",to:"/results"}},[t._v(" View Analysis Results ")]):t._e()],1)],1)],1)},n=[],r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-card",{staticClass:"d-flex flex-column",attrs:{height:t.height}},[i("v-card-title",[t._v("Analysis Form")]),i("v-card-text",[i("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"Input Directory",type:"text",rules:[t.rules.required],required:""},model:{value:t.inputDirectory,callback:function(e){t.inputDirectory=e},expression:"inputDirectory"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" The input directory must be the full path to the 'fastq_pass' subfolder of an ONT sequencing run, and have sub-folders named for each demultiplexed (demux) barcode (this is default for demux by MinKNOW). Currently, sub-folder names are expected to be from 'barcode01' to 'barcode12'. ")])]),i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"Reference Database",type:"text",rules:[t.rules.required],required:""},model:{value:t.refDirectory,callback:function(e){t.refDirectory=e},expression:"refDirectory"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" The reference directory must be the full path to the Amplicon database and prefix of the database created by blastn. For example /home/database/Amplicon_blastdb/Amplicon_set. ")])]),i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"NTC Barcodes",type:"text",rules:[t.rules.required],required:""},model:{value:t.barcodes,callback:function(e){t.barcodes=e},expression:"barcodes"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" Additionally, one of the 12 barcodes is reserved for a NTC (nontemplate control). This is used for the final threshold for calling a positive amplicon (T3). ")])]),i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"Analysis Interval (in seconds)",type:"number",rules:[t.rules.required],required:""},model:{value:t.analysisInterval,callback:function(e){t.analysisInterval=e},expression:"analysisInterval"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" The analysis interval is set to running the analysis on the input directory every 60 seconds. A maximum of 10 minutes is set internally, and will override any value larger than 600. This is to keep analysis processing time within a reasonable range. Note that reads processed in the previous interval are not processed in the next, and their counts are carried over to the latest results files. ")])]),i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[i("v-text-field",t._g(t._b({attrs:{label:"Number of Threads",type:"number",rules:[t.rules.required],required:""},model:{value:t.threads,callback:function(e){t.threads=e},expression:"threads"}},"v-text-field",n,!1),s))]}}])},[i("span",[t._v(" The default thread count is set to 1, and should only be increased if you know your system well. It is recommended that if sequencing, basecalling, and demultiplexing are running concurrently with this application, that the thread count be set no greater than half the total threads available on the system. ")])]),i("v-btn",{staticClass:"mr-4",attrs:{color:"success",disabled:!t.valid},on:{click:t.startAnalysis}},[t._v(" Start ")]),i("v-btn",{staticClass:"mr-4",attrs:{color:"error",disabled:!t.stopvalid},on:{click:t.stopAnalysis}},[t._v(" Stop ")])],1)],1)],1)},a=[],o=(i("498a"),i("917a")),l={name:"AnalysisForm",props:{height:String},data:function(){return{valid:!0,stopvalid:!1,inputDirectory:"/app/DATA/fastq_pass/",refDirectory:"/app/DATA/Amplicon_blastdb/Amplicon_set",barcodes:"barcode10,barcode11,barcode12",analysisInterval:"10",threads:"1",rules:{required:function(t){return!!t&&""!==t.trim()||"This field is required"}}}},methods:{startAnalysis:function(){if(this.$refs.form.validate()){var t={inputDirectory:this.inputDirectory,refDirectory:this.refDirectory,barcodeList:this.barcodes,analysisInterval:this.analysisInterval,numThreads:this.threads};o["a"].startAnalysis(t).then(this.handleSuccess).catch(this.handleError)}},stopAnalysis:function(){o["a"].stopAnalysis().then(this.handleSuccess).catch(this.handleError)},handleSuccess:function(t){this.valid=!1,this.stopvalid=!0;var e=t.data;this.$emit("response",{message:e.message,type:"success"})},handleError:function(t){var e=t.response,i=500!==e.status?e.data.message:"An error occurred with the server.";this.$emit("response",{message:i,type:"error"})}}},c=l,u=(i("dfb1"),i("2877")),d=i("6544"),h=i.n(d),p=i("8336"),f=i("b0af"),v=i("99d9"),m=i("5530"),b=(i("caad"),i("2532"),i("07ac"),i("4de4"),i("d3b7"),i("159b"),i("7db0"),i("58df")),g=i("7e2b"),y=i("3206"),_=Object(b["a"])(g["a"],Object(y["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var e=Object.values(t).includes(!0);this.$emit("input",!e)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var e=this,i=function(t){return t.$watch("hasError",(function(i){e.$set(e.errorBag,t._uid,i)}),{immediate:!0})},s={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?s.shouldValidate=t.$watch("shouldValidate",(function(n){n&&(e.errorBag.hasOwnProperty(t._uid)||(s.valid=i(t)))})):s.valid=i(t),s},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var e=this.inputs.find((function(e){return e._uid===t._uid}));if(e){var i=this.watchers.find((function(t){return t._uid===e._uid}));i&&(i.valid(),i.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==e._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==e._uid})),this.$delete(this.errorBag,e._uid)}}},render:function(t){var e=this;return t("form",{staticClass:"v-form",attrs:Object(m["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return e.$emit("submit",t)}}},this.$slots.default)}}),x=i("8654"),A=i("ade3"),C=(i("a9e3"),i("9734"),i("4ad4")),w=i("a9ad"),B=i("16b7"),T=i("b848"),$=i("f573"),O=i("f2e7"),k=i("80d2"),S=i("d9bd"),D=Object(b["a"])(w["a"],B["a"],T["a"],$["a"],O["a"]).extend({name:"v-tooltip",props:{closeDelay:{type:[Number,String],default:0},disabled:Boolean,openDelay:{type:[Number,String],default:0},openOnHover:{type:Boolean,default:!0},openOnFocus:{type:Boolean,default:!0},tag:{type:String,default:"span"},transition:String},data:function(){return{calculatedMinWidth:0,closeDependents:!1}},computed:{calculatedLeft:function(){var t=this.dimensions,e=t.activator,i=t.content,s=!this.bottom&&!this.left&&!this.top&&!this.right,n=!1!==this.attach?e.offsetLeft:e.left,r=0;return this.top||this.bottom||s?r=n+e.width/2-i.width/2:(this.left||this.right)&&(r=n+(this.right?e.width:-i.width)+(this.right?10:-10)),this.nudgeLeft&&(r-=parseInt(this.nudgeLeft)),this.nudgeRight&&(r+=parseInt(this.nudgeRight)),"".concat(this.calcXOverflow(r,this.dimensions.content.width),"px")},calculatedTop:function(){var t=this.dimensions,e=t.activator,i=t.content,s=!1!==this.attach?e.offsetTop:e.top,n=0;return this.top||this.bottom?n=s+(this.bottom?e.height:-i.height)+(this.bottom?10:-10):(this.left||this.right)&&(n=s+e.height/2-i.height/2),this.nudgeTop&&(n-=parseInt(this.nudgeTop)),this.nudgeBottom&&(n+=parseInt(this.nudgeBottom)),!1===this.attach&&(n+=this.pageYOffset),"".concat(this.calcYOverflow(n),"px")},classes:function(){return{"v-tooltip--top":this.top,"v-tooltip--right":this.right,"v-tooltip--bottom":this.bottom,"v-tooltip--left":this.left,"v-tooltip--attached":""===this.attach||!0===this.attach||"attach"===this.attach}},computedTransition:function(){return this.transition?this.transition:this.isActive?"scale-transition":"fade-transition"},offsetY:function(){return this.top||this.bottom},offsetX:function(){return this.left||this.right},styles:function(){return{left:this.calculatedLeft,maxWidth:Object(k["e"])(this.maxWidth),minWidth:Object(k["e"])(this.minWidth),top:this.calculatedTop,zIndex:this.zIndex||this.activeZIndex}}},beforeMount:function(){var t=this;this.$nextTick((function(){t.value&&t.callActivate()}))},mounted:function(){"v-slot"===Object(k["q"])(this,"activator",!0)&&Object(S["b"])("v-tooltip's activator slot must be bound, try '<template #activator=\"data\"><v-btn v-on=\"data.on>'",this)},methods:{activate:function(){this.updateDimensions(),requestAnimationFrame(this.startTransition)},deactivate:function(){this.runDelay("close")},genActivatorListeners:function(){var t=this,e=C["a"].options.methods.genActivatorListeners.call(this);return this.openOnFocus&&(e.focus=function(e){t.getActivator(e),t.runDelay("open")},e.blur=function(e){t.getActivator(e),t.runDelay("close")}),e.keydown=function(e){e.keyCode===k["u"].esc&&(t.getActivator(e),t.runDelay("close"))},e},genActivatorAttributes:function(){return{"aria-haspopup":!0,"aria-expanded":String(this.isActive)}},genTransition:function(){var t=this.genContent();return this.computedTransition?this.$createElement("transition",{props:{name:this.computedTransition}},[t]):t},genContent:function(){var t;return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-tooltip__content",class:(t={},Object(A["a"])(t,this.contentClass,!0),Object(A["a"])(t,"menuable__content__active",this.isActive),Object(A["a"])(t,"v-tooltip__content--fixed",this.activatorFixed),t),style:this.styles,attrs:this.getScopeIdAttrs(),directives:[{name:"show",value:this.isContentActive}],ref:"content"}),this.getContentSlot())}},render:function(t){var e=this;return t(this.tag,{staticClass:"v-tooltip",class:this.classes},[this.showLazyContent((function(){return[e.genTransition()]})),this.genActivator()])}}),I=Object(u["a"])(c,r,a,!1,null,"457c45a8",null),V=I.exports;h()(I,{VBtn:p["a"],VCard:f["a"],VCardText:v["b"],VCardTitle:v["c"],VForm:_,VTextField:x["a"],VTooltip:D});var E=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-card",{attrs:{height:t.height}},[i("v-card-title",[t._v("Analysis Log")]),i("v-card-text",[i("div",{staticClass:"text-body-2"},[t._v(t._s(t.log.data))])])],1)},j=[],q=i("4360"),L={name:"AnalysisLog",props:{height:String},data:function(){return{log:q["a"].state.log}}},F=L,N=(i("eca5"),Object(u["a"])(F,E,j,!1,null,"535510d3",null)),W=N.exports;h()(N,{VCard:f["a"],VCardText:v["b"],VCardTitle:v["c"]});var z={name:"Analysis",components:{AnalysisForm:V,AnalysisLog:W},data:function(){return{alert:!1,height:"475px",responseType:"success",responseMessage:"",plot:q["a"].state.plot,org:q["a"].state.org}},methods:{handleResponse:function(t){this.responseType=t.type,this.responseMessage=t.message,this.alert=!0}}},R=z,M=(i("0c18"),i("10d2")),Y=i("afdd"),J=i("9d26"),P=i("7560"),X=i("2b0e"),H=X["a"].extend({name:"transitionable",props:{mode:String,origin:String,transition:String}}),K=Object(b["a"])(M["a"],O["a"],H).extend({name:"v-alert",props:{border:{type:String,validator:function(t){return["top","right","bottom","left"].includes(t)}},closeLabel:{type:String,default:"$vuetify.close"},coloredBorder:Boolean,dense:Boolean,dismissible:Boolean,closeIcon:{type:String,default:"$cancel"},icon:{default:"",type:[Boolean,String],validator:function(t){return"string"===typeof t||!1===t}},outlined:Boolean,prominent:Boolean,text:Boolean,type:{type:String,validator:function(t){return["info","error","success","warning"].includes(t)}},value:{type:Boolean,default:!0}},computed:{__cachedBorder:function(){if(!this.border)return null;var t={staticClass:"v-alert__border",class:Object(A["a"])({},"v-alert__border--".concat(this.border),!0)};return this.coloredBorder&&(t=this.setBackgroundColor(this.computedColor,t),t.class["v-alert__border--has-color"]=!0),this.$createElement("div",t)},__cachedDismissible:function(){var t=this;if(!this.dismissible)return null;var e=this.iconColor;return this.$createElement(Y["a"],{staticClass:"v-alert__dismissible",props:{color:e,icon:!0,small:!0},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:function(){return t.isActive=!1}}},[this.$createElement(J["a"],{props:{color:e}},this.closeIcon)])},__cachedIcon:function(){return this.computedIcon?this.$createElement(J["a"],{staticClass:"v-alert__icon",props:{color:this.iconColor}},this.computedIcon):null},classes:function(){var t=Object(m["a"])(Object(m["a"])({},M["a"].options.computed.classes.call(this)),{},{"v-alert--border":Boolean(this.border),"v-alert--dense":this.dense,"v-alert--outlined":this.outlined,"v-alert--prominent":this.prominent,"v-alert--text":this.text});return this.border&&(t["v-alert--border-".concat(this.border)]=!0),t},computedColor:function(){return this.color||this.type},computedIcon:function(){return!1!==this.icon&&("string"===typeof this.icon&&this.icon?this.icon:!!["error","info","success","warning"].includes(this.type)&&"$".concat(this.type))},hasColoredIcon:function(){return this.hasText||Boolean(this.border)&&this.coloredBorder},hasText:function(){return this.text||this.outlined},iconColor:function(){return this.hasColoredIcon?this.computedColor:void 0},isDark:function(){return!(!this.type||this.coloredBorder||this.outlined)||P["a"].options.computed.isDark.call(this)}},created:function(){this.$attrs.hasOwnProperty("outline")&&Object(S["a"])("outline","outlined",this)},methods:{genWrapper:function(){var t=[this.$slots.prepend||this.__cachedIcon,this.genContent(),this.__cachedBorder,this.$slots.append,this.$scopedSlots.close?this.$scopedSlots.close({toggle:this.toggle}):this.__cachedDismissible],e={staticClass:"v-alert__wrapper"};return this.$createElement("div",e,t)},genContent:function(){return this.$createElement("div",{staticClass:"v-alert__content"},this.$slots.default)},genAlert:function(){var t={staticClass:"v-alert",attrs:{role:"alert"},on:this.listeners$,class:this.classes,style:this.styles,directives:[{name:"show",value:this.isActive}]};if(!this.coloredBorder){var e=this.hasText?this.setTextColor:this.setBackgroundColor;t=e(this.computedColor,t)}return this.$createElement("div",t,[this.genWrapper()])},toggle:function(){this.isActive=!this.isActive}},render:function(t){var e=this.genAlert();return this.transition?t("transition",{props:{name:this.transition,origin:this.origin,mode:this.mode}},[e]):e}}),Z=i("62ad"),G=i("0fd9"),Q=Object(u["a"])(R,s,n,!1,null,null,null);e["default"]=Q.exports;h()(Q,{VAlert:K,VBtn:p["a"],VCol:Z["a"],VRow:G["a"]})},dfb1:function(t,e,i){"use strict";i("07b0")},eca5:function(t,e,i){"use strict";i("159c")}}]);
//# sourceMappingURL=chunk-f36ecf2c.a39fc66f.js.map