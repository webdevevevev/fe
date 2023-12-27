import{d as Y,u as Z,O as y,L as x,A as ee,G as se,S as g,M as C,j as te,r as B,b as c,o as d,m as w,i as l,y as r,c as b,w as s,g as f,k as n,N as D,P as N,e as o,B as ae,Q as oe,R as ne,T as le,F as ie,n as de,K as ce,V as re,W as ue,D as pe,H as _e,p as be,h as fe,_ as me}from"./index-95bede86.js";const ve=m=>(be("data-v-7969b409"),m=m(),fe(),m),ye={class:"header"},we={class:"title"},ke={class:"spans"},ge={class:"price"},$e={class:"time"},he={class:"ctime"},Ce={class:"mtime"},Ve={class:"expire"},Se={class:"desc"},Ie=["src"],Ae={key:2},Le=ve(()=>l("div",{class:"el-upload__tip"}," 支持上传图片和视频 ",-1)),je={class:"dialog-footer"},F="/uploads",Pe=Y({__name:"Post",props:{base:{}},emits:["publish"],setup(m,{emit:O}){const i=m,U=O,$=Z(),V=i.base instanceof y?x:ee,S=i.base instanceof y?se:g,h=C(()=>i.base.state!==g.pending),v=C(()=>{var e;return((e=i.base.user)==null?void 0:e.id)===$.getters.userId}),p=te(!1);let u=B(i.base instanceof y?I():i.base);const z=C(()=>v.value||i.base.state!==S.pending);function I(){const e=new ce;return e.userId=$.getters.userId,e.user.id=e.userId,e.user.nickname=$.state.nickname,e.offerId=i.base.id,e.offer=new y,e.offer.id=e.offerId,e}function M(){return v.value?R(i.base):T()}function R(e){return p.value=!1,re(e)}async function T(){p.value=!1;const e=await ue(u),t=u;u=B(I()),t.id=e,U("publish",t)}async function E(){const e=i.base;await pe(e.id),e.state=g.accepted}async function G(){const e=i.base;await _e(e.id),e.state=g.rejected}return(e,t)=>{var L,j,P;const k=c("el-tooltip"),_=c("el-button"),H=c("el-icon"),K=c("el-button-group"),Q=c("el-image"),W=c("el-input"),A=c("el-form-item"),q=c("el-upload"),J=c("el-form"),X=c("el-dialog");return d(),w("article",null,[l("header",ye,[l("h2",we,r((L=e.base)==null?void 0:L.title),1),l("div",ke,[isFinite(e.base.type)?(d(),b(k,{key:0,content:`类型：${n(D)[e.base.type]}`},{default:s(()=>[f(r(n(D)[e.base.type]),1)]),_:1},8,["content"])):N("",!0),o(k,{content:`状态：${n(V)[e.base.state]}`},{default:s(()=>[l("span",{class:ae(["state",n(S)[e.base.state]])},r(n(V)[e.base.state]),3)]),_:1},8,["content"]),l("span",ge,r((j=e.base)==null?void 0:j.price)+"元",1)]),e.base instanceof n(y)?(d(),b(_,{key:0,type:"primary",class:"action-btn",disabled:z.value,onClick:t[0]||(t[0]=a=>p.value=!0)},{default:s(()=>[f(" 发布响应 ")]),_:1},8,["disabled"])):v.value?(d(),b(_,{key:1,type:"primary",class:"action-btn",onClick:t[1]||(t[1]=a=>p.value=!0),disabled:h.value},{default:s(()=>[f(" 修改响应 ")]),_:1},8,["disabled"])):(d(),b(K,{key:2,size:"small",onClick:t[2]||(t[2]=le(()=>{},["stop"])),class:"action-btn"},{default:s(()=>[o(k,{content:"接受"},{default:s(()=>[o(_,{icon:n(oe),onClick:E,disabled:h.value},null,8,["icon","disabled"])]),_:1}),o(k,{content:"拒绝"},{default:s(()=>[o(_,{class:"reject-btn",onClick:G,disabled:h.value},{default:s(()=>[o(H,{color:"red"},{default:s(()=>[o(n(ne))]),_:1})]),_:1},8,["disabled"])]),_:1})]),_:1}))]),l("div",$e,[l("span",he,"发布于"+r(e.base.ctime),1),l("span",Ce,"修改于"+r(e.base.mtime),1),l("p",Ve,"过期于"+r((P=e.base)==null?void 0:P.expire),1)]),l("p",Se,r(e.base.desc),1),(d(!0),w(ie,null,de(e.base.files,a=>(d(),w("p",{key:a},[/\.(?:(?:pn|jpe?)g|webp)$/.test(a)?(d(),b(Q,{key:0,src:`${F}/${a}`,alt:a},null,8,["src","alt"])):/\.(?:webm|mp4)$/.test(a)?(d(),w("video",{key:1,src:`${F}/${a}`,controls:""},null,8,Ie)):(d(),w("span",Ae,r(a),1))]))),128)),o(X,{modelValue:p.value,"onUpdate:modelValue":t[6]||(t[6]=a=>p.value=a),title:`${v.value?"修改":"发布"}响应`},{footer:s(()=>[l("span",je,[o(_,{onClick:t[5]||(t[5]=a=>p.value=!1)},{default:s(()=>[f("取消")]),_:1}),o(_,{type:"primary",onClick:M},{default:s(()=>[f(" 提交 ")]),_:1})])]),default:s(()=>[o(J,{model:n(u),class:"publish-form","label-width":"80px"},{default:s(()=>[o(A,{label:"描述"},{default:s(()=>[o(W,{modelValue:n(u).desc,"onUpdate:modelValue":t[3]||(t[3]=a=>n(u).desc=a),type:"textarea",autocomplete:"off"},null,8,["modelValue"])]),_:1}),v.value?N("",!0):(d(),b(A,{key:0,label:"文件列表"},{default:s(()=>[o(q,{"file-list":n(u).files,"onUpdate:fileList":t[4]||(t[4]=a=>n(u).files=a),class:"upload","auto-upload":!1,multiple:""},{trigger:s(()=>[o(_,{type:"primary"},{default:s(()=>[f("选择文件")]),_:1})]),tip:s(()=>[Le]),_:1},8,["file-list"])]),_:1}))]),_:1},8,["model"])]),_:1},8,["modelValue","title"])])}}});const De=me(Pe,[["__scopeId","data-v-7969b409"]]);export{De as P};
