(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-234ba008"],{1276:function(e,t,i){"use strict";var n=i("d784"),r=i("44e7"),a=i("825a"),l=i("1d80"),s=i("4840"),o=i("8aa5"),c=i("50c4"),u=i("577e"),d=i("14c3"),f=i("9263"),p=i("9f7f"),h=i("d039"),m=p.UNSUPPORTED_Y,v=[].push,b=Math.min,g=4294967295,_=!h((function(){var e=/(?:)/,t=e.exec;e.exec=function(){return t.apply(this,arguments)};var i="ab".split(e);return 2!==i.length||"a"!==i[0]||"b"!==i[1]}));n("split",(function(e,t,i){var n;return n="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(e,i){var n=u(l(this)),a=void 0===i?g:i>>>0;if(0===a)return[];if(void 0===e)return[n];if(!r(e))return t.call(n,e,a);var s,o,c,d=[],p=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),h=0,m=new RegExp(e.source,p+"g");while(s=f.call(m,n)){if(o=m.lastIndex,o>h&&(d.push(n.slice(h,s.index)),s.length>1&&s.index<n.length&&v.apply(d,s.slice(1)),c=s[0].length,h=o,d.length>=a))break;m.lastIndex===s.index&&m.lastIndex++}return h===n.length?!c&&m.test("")||d.push(""):d.push(n.slice(h)),d.length>a?d.slice(0,a):d}:"0".split(void 0,0).length?function(e,i){return void 0===e&&0===i?[]:t.call(this,e,i)}:t,[function(t,i){var r=l(this),a=void 0==t?void 0:t[e];return void 0!==a?a.call(t,r,i):n.call(u(r),t,i)},function(e,r){var l=a(this),f=u(e),p=i(n,l,f,r,n!==t);if(p.done)return p.value;var h=s(l,RegExp),v=l.unicode,_=(l.ignoreCase?"i":"")+(l.multiline?"m":"")+(l.unicode?"u":"")+(m?"g":"y"),k=new h(m?"^(?:"+l.source+")":l,_),y=void 0===r?g:r>>>0;if(0===y)return[];if(0===f.length)return null===d(k,f)?[f]:[];var x=0,w=0,E=[];while(w<f.length){k.lastIndex=m?0:w;var C,S=d(k,m?f.slice(w):f);if(null===S||(C=b(c(k.lastIndex+(m?w:0)),f.length))===x)w=o(f,w,v);else{if(E.push(f.slice(x,w)),E.length===y)return E;for(var O=1;O<=S.length-1;O++)if(E.push(S[O]),E.length===y)return E;w=x=C}}return E.push(f.slice(x)),E}]}),!_,m)},"7d6b":function(e,t,i){},"9c88":function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"File"},[i("el-row",{staticStyle:{margin:"20px 0 20px"},attrs:{gutter:20}},[i("el-col",{attrs:{span:12}},[i("input",{ref:"fileEle",staticStyle:{display:"none"},attrs:{type:"file"},on:{change:e.upload}}),i("el-button",{staticStyle:{"margin-right":"15px"},attrs:{type:"primary"},on:{click:function(t){return e.$refs.fileEle.click()}}},[i("i",{staticClass:"el-icon-upload el-icon--left"}),e._v("上传")]),i("el-popover",{staticClass:"popover",attrs:{placement:"top",trigger:"click"}},[i("el-button",{attrs:{slot:"reference"},slot:"reference"},[i("i",{staticClass:"el-icon-plus el-icon--left"}),e._v("新建")]),i("ul",{staticClass:"menu"},[i("li",{on:{click:function(t){e.centerDialogVisible=!0}}},[i("i",{staticClass:"el-icon-folder-add el-icon--left"}),e._v("新建文件夹 ")]),i("li",[i("i",{staticClass:"el-icon-document-add el-icon--left"}),e._v("新建文件")])])],1),i("el-button",{staticStyle:{"margin-left":"15px"}},[i("i",{staticClass:"el-icon-finished el-icon--left"}),e._v("全选")])],1),i("el-col",{attrs:{span:3,offset:6}},[i("el-input",{attrs:{placeholder:"请输入内容","suffix-icon":"el-icon-search"},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchFile.apply(null,arguments)}},model:{value:e.searchWord,callback:function(t){e.searchWord=t},expression:"searchWord"}})],1)],1),i("div",{staticClass:"breadcrumb"},[i("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},e._l(e.routers,(function(t,n){return i("el-breadcrumb-item",{key:n},[i("span",{staticClass:"nav_link",on:{click:function(i){return e.goBack(t,n)}}},[e._v(e._s(t.file_name))])])})),1)],1),i("div",{staticClass:"fileList"},[i("Folder",{ref:"folder",attrs:{searchFileItem:e.searchFileItem}})],1),i("div",{staticClass:"file-page"},[i("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.fileTotal,"page-size":e.pageLimit},on:{"prev-click":e.prevClick,"next-click":e.nextClick}})],1),i("transition",{attrs:{name:"slide-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.footerMenuShow,expression:"footerMenuShow"}],staticClass:"footerMenu",on:{click:function(t){e.footerMenuShow=!e.footerMenuShow}}},[i("div",{staticClass:"footItem"},[i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"下载",placement:"top-start"}},[i("el-button",{attrs:{icon:"el-icon-download"}})],1),i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"收藏",placement:"top-start"}},[i("el-button",{attrs:{icon:"el-icon-star-off"}})],1),i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"转发",placement:"top-start"}},[i("el-button",{attrs:{icon:"el-icon-share"}})],1),i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"删除",placement:"top-start"}},[i("el-button",{attrs:{icon:"el-icon-delete"}})],1),i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"更多",placement:"top-start"}},[i("el-button",{attrs:{icon:"el-icon-more"}})],1),i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"取消选择",placement:"top-start"}},[i("el-button",{attrs:{icon:"el-icon-circle-close"}})],1)],1)])]),i("div",{staticClass:"mkdir"},[i("el-dialog",{attrs:{title:"提示",visible:e.centerDialogVisible,width:"30%",center:""},on:{"update:visible":function(t){e.centerDialogVisible=t}}},[i("el-input",{attrs:{placeholder:"请输入文件夹名"},model:{value:e.dirParams.dir_name,callback:function(t){e.$set(e.dirParams,"dir_name",t)},expression:"dirParams.dir_name"}}),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(t){e.centerDialogVisible=!1}}},[e._v("取 消")]),i("el-button",{attrs:{type:"primary"},on:{click:e.mkdir_btn}},[e._v("确 定")])],1)],1)],1),i("transition",{attrs:{name:"slide-to-right"}},[e.upload_Ele?i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"upload_file_state"},[i("el-card",{staticClass:"box-card"},[i("span",[e._v("上传进度：")]),e._l(1,(function(t){return i("div",{key:t,staticClass:"item"},[i("span",{staticClass:"file_name"},[e._v(e._s(e.upload_name))]),isNaN(e.percentage)?e._e():i("el-progress",{staticStyle:{width:"280px",display:"inline-block","margin-left":"10px"},attrs:{percentage:e.percentage}})],1)})),i("p",[e._v("tip：上传过程中不要离开此页面")])],2)],1):e._e()])],1)},r=[];function a(e){if(Array.isArray(e))return e}i("a4d3"),i("e01a"),i("d3b7"),i("d28b"),i("3ca3"),i("ddb0");function l(e,t){var i=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var n,r,a=[],l=!0,s=!1;try{for(i=i.call(e);!(l=(n=i.next()).done);l=!0)if(a.push(n.value),t&&a.length===t)break}catch(o){s=!0,r=o}finally{try{l||null==i["return"]||i["return"]()}finally{if(s)throw r}}return a}}i("fb6a"),i("b0c0"),i("a630");function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}function o(e,t){if(e){if("string"===typeof e)return s(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?s(e,t):void 0}}function c(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(e,t){return a(e)||l(e,t)||o(e,t)||c()}var d=i("1da1"),f=i("5530"),p=(i("96cf"),i("ac1f"),i("1276"),i("99af"),i("3f5e")),h=i("25a9"),m=i("f65e"),v=i("bbfb"),b=i("2f62"),g={data:function(){return{checked:null,searchWord:null,checkAll:!1,fileList:[],isIndeterminate:!0,menuShow:!1,footerMenuShow:!1,menuEle:null,clickIndex:null,centerDialogVisible:!1,dirParams:{dir_name:"新建文件夹",type:"folder"},chunkSize:1048576,partList:[],total:0,index:0,upload_name:"",upload_Ele:!1,percentage:0,loading:!1,searchFileItem:[]}},components:{Folder:v["default"]},computed:Object(f["a"])(Object(f["a"])({},Object(b["d"])("user",["userInfo"])),Object(b["d"])("file",["routers","parent_file_id","fileTotal","currentPage","totalPage","pageLimit"])),methods:Object(f["a"])(Object(f["a"])({upload:function(e){var t=this;return Object(d["a"])(regeneratorRuntime.mark((function i(){var n,r,a,l,s,o,c,d,f,p,h,m;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:if(n=t.userInfo,r=n.drive_used,a=n.drive_size,!(r>=a)){i.next=3;break}return i.abrupt("return",t.$message.error("当前账户可用空间不足"));case 3:if(l=e.target.files[0],l){i.next=6;break}return i.abrupt("return");case 6:t.upload_name=l.name,s=0;case 8:if(!(s<=l.size)){i.next=20;break}if(s=t.total*t.chunkSize,o=l.name.split("."),c=u(o,2),d=c[0],f=c[1],p=l.slice(s,s+t.chunkSize),h="".concat(d,".").concat(t.total,".").concat(f),m=new File([p],h),t.partList.push(m),t.total+=1,!(s>=l.size)){i.next=18;break}return i.abrupt("break",20);case 18:i.next=8;break;case 20:t.sendRequest(e);case 21:case"end":return i.stop()}}),i)})))()},progressPerce:function(e){var t=parseInt(e/this.total*100);this.percentage=100==t?99:t},sendRequest:function(e){var t=this;return Object(d["a"])(regeneratorRuntime.mark((function i(){var n,r,a,l;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:t.upload_Ele=!0,t.index=0,n=t.partList,r=n.length,a=0;case 4:if(!(a<r)){i.next=14;break}return l=new FormData,l.append("file",n.shift()),i.next=9,Object(p["o"])(l);case 9:t.index++,t.progressPerce(t.index);case 11:a++,i.next=4;break;case 14:setTimeout((function(){t.mergeFile(e)}),4e3);case 15:case"end":return i.stop()}}),i)})))()},mergeFile:function(e){var t=this,i=e.target.files[0],n=i.name,r=Object(m["a"])(n),a=i.size,l=i.type,s=Object(h["a"])("YYYY-MM-DD hh:mm:ss"),o=this.userInfo.drive_id,c=this.parent_file_id;Object(p["j"])({drive_id:o,file_id:r,file_name:n,parent_file_id:c,file_size:a,file_type:l,created_at:s,updated_at:s}).then(function(){var e=Object(d["a"])(regeneratorRuntime.mark((function e(i){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.getUserDrive();case 2:t.$refs.folder.getUserFile(),t.$message.success(i.message);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),this.upload_Ele=!1,this.total=0,this.index=0,this.percentage=0},mkdir_btn:function(){var e=this,t=this.userInfo.drive_id,i=Object(h["a"])("YYYY-MM-DD hh:mm:ss"),n=this.dirParams,r=n.dir_name,a=n.type,l=this.parent_file_id,s=Object(m["a"])(l+r);Object(p["k"])({drive_id:t,parent_file_id:l,file_id:s,filename:r,type:a,created_at:i,updated_at:i}).then((function(){e.$refs.folder.getUserFile()})),this.centerDialogVisible=!1},download_url:function(){var e=this.fileList[this.clickIndex],t=e.download_url,i=e.name;console.log(t,i);var n=document.createElement("a");n.download=i,n.style.display="none",n.href=t,document.body.appendChild(n),n.click(),console.log(n),document.body.removeChild(n)},searchFile:function(){var e=this;this.SET_ROUTER({name:"".concat(this.searchWord,"的搜索结果"),path:Date.now()}),Object(p["h"])({searchWord:this.searchWord,drive_id:this.userInfo.drive_id}).then((function(t){e.searchWord="",e.searchFileItem=t.data}))},goBack:function(e,t){this.SET_PARENT_FILE_ID(e.path),this.REMOVE_ROUTER(t+1),this.$refs.folder.getUserFile()},prevClick:function(e){this.SET_CURRENT_PAGE(e),this.$refs.folder.getUserFile()},nextClick:function(e){this.SET_CURRENT_PAGE(e),this.$refs.folder.getUserFile()}},Object(b["c"])("file",["REMOVE_ROUTER","SET_PARENT_FILE_ID","SET_FAVORITE","SET_ROUTER","SET_CURRENT_PAGE"])),Object(b["b"])("user",["getUserDrive"])),created:function(){this.SET_FAVORITE("file")},mounted:function(){this.menuEle=this.$refs.fileMenu}},_=g,k=(i("dd38"),i("2877")),y=Object(k["a"])(_,n,r,!1,null,"39947c19",null);t["default"]=y.exports},a630:function(e,t,i){var n=i("23e7"),r=i("4df4"),a=i("1c7e"),l=!a((function(e){Array.from(e)}));n({target:"Array",stat:!0,forced:l},{from:r})},d28b:function(e,t,i){var n=i("746f");n("iterator")},dd38:function(e,t,i){"use strict";i("7d6b")},e01a:function(e,t,i){"use strict";var n=i("23e7"),r=i("83ab"),a=i("da84"),l=i("5135"),s=i("861d"),o=i("9bf2").f,c=i("e893"),u=a.Symbol;if(r&&"function"==typeof u&&(!("description"in u.prototype)||void 0!==u().description)){var d={},f=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),t=this instanceof f?new u(e):void 0===e?u():u(e);return""===e&&(d[t]=!0),t};c(f,u);var p=f.prototype=u.prototype;p.constructor=f;var h=p.toString,m="Symbol(test)"==String(u("test")),v=/^Symbol\((.*)\)[^)]+$/;o(p,"description",{configurable:!0,get:function(){var e=s(this)?this.valueOf():this,t=h.call(e);if(l(d,e))return"";var i=m?t.slice(7,-1):t.replace(v,"$1");return""===i?void 0:i}}),n({global:!0,forced:!0},{Symbol:f})}}}]);