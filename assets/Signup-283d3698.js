import{d as j,a as F,u as M,r as O,i as c,b as p,c as b,e,w as s,F as y,U as k,o as v,j as I,I as z,k as U,l as h,m as L,f as x,p as R,g as $,h as q,v as A,E as r,n as G,_ as H}from"./index-2f0df12b.js";const J=_=>(R("data-v-aef7e71d"),_=_(),$(),_),K=J(()=>q("h2",null,"注册",-1)),Q=j({__name:"Signup",setup(_){const N=F(),d=M(),a=O(new k),u=c(-1),f=c(-1),V=c(""),S=c(!0),g=c(!1);d.dispatch("getProvinces").then(()=>S.value=!1);async function D(){const i=await A(a);if(i.length){for(const{constraints:t}of i)if(t)for(const m of Object.values(t))r.error({showClose:!0,message:m});return console.error(i)}if(u.value<0){r.error({showClose:!0,message:"请选择省份"});return}if(f.value<0){r.error({showClose:!0,message:"请选择城市"});return}if(V.value!==a.pwd){r.error({showClose:!0,message:"密码不一致"});return}const o=d.state.provinces[u.value];a.provinceId=o.id,a.cityId=o.cities[f.value].id;let n;try{n=await G(a,!1)}catch(t){return r.error({showClose:!0,message:t.message}),console.error(t)}n instanceof k?(d.commit("signin",n),r.success({showClose:!0,message:"注册成功"}),N.push({name:"signin"})):r.error({showClose:!0,message:n})}async function P(){if(f.value=-1,!(u.value<0)){g.value=!0;try{await d.dispatch("getCities",d.state.provinces[u.value].id)}catch(i){r.error({showClose:!0,message:i.message}),console.error(i)}finally{g.value=!1}}}return(i,o)=>{const n=p("el-input"),t=p("el-form-item"),m=p("el-option"),w=p("el-select"),B=p("el-button"),E=p("router-link"),T=p("el-form");return v(),b(y,null,[K,e(T,{model:a,"label-width":"80px"},{default:s(()=>[e(t,{label:"用户名"},{default:s(()=>[e(n,{modelValue:a.nickname,"onUpdate:modelValue":o[0]||(o[0]=l=>a.nickname=l)},null,8,["modelValue"])]),_:1}),e(t,{label:"密码"},{default:s(()=>[e(n,{modelValue:a.pwd,"onUpdate:modelValue":o[1]||(o[1]=l=>a.pwd=l),type:"password","show-password":""},null,8,["modelValue"])]),_:1}),e(t,{label:"重复密码"},{default:s(()=>[e(n,{modelValue:V.value,"onUpdate:modelValue":o[2]||(o[2]=l=>V.value=l),type:"password","show-password":""},null,8,["modelValue"])]),_:1}),e(t,{label:"姓名"},{default:s(()=>[e(n,{modelValue:a.name,"onUpdate:modelValue":o[3]||(o[3]=l=>a.name=l)},null,8,["modelValue"])]),_:1}),e(t,{label:"证件类型"},{default:s(()=>[e(w,{modelValue:a.IDCardType,"onUpdate:modelValue":o[4]||(o[4]=l=>a.IDCardType=l)},{default:s(()=>[e(m,{label:"中华人民共和国居民身份证",value:I(z).zhCN},null,8,["value"])]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"证件号码"},{default:s(()=>[e(n,{modelValue:a.IDCardNo,"onUpdate:modelValue":o[5]||(o[5]=l=>a.IDCardNo=l)},null,8,["modelValue"])]),_:1}),e(t,{label:"手机号码"},{default:s(()=>[e(n,{modelValue:a.phone,"onUpdate:modelValue":o[6]||(o[6]=l=>a.phone=l)},null,8,["modelValue"])]),_:1}),e(t,{label:"用户简介"},{default:s(()=>[e(n,{modelValue:a.intro,"onUpdate:modelValue":o[7]||(o[7]=l=>a.intro=l)},null,8,["modelValue"])]),_:1}),e(t,{label:"注册城市"},{default:s(()=>[e(w,{modelValue:u.value,"onUpdate:modelValue":o[8]||(o[8]=l=>u.value=l),onChange:P},{default:s(()=>[e(m,{label:"请选择省份",value:-1}),(v(!0),b(y,null,U(I(d).state.provinces,(l,C)=>(v(),h(m,{key:l.id,label:l.name,value:C},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),e(w,{modelValue:f.value,"onUpdate:modelValue":o[9]||(o[9]=l=>f.value=l),filterable:"",loading:g.value},{default:s(()=>[e(m,{label:"请选择城市",value:-1}),u.value>=0?(v(!0),b(y,{key:0},U(I(d).state.provinces[u.value].cities,(l,C)=>(v(),h(m,{key:l.id,label:l.name,value:C},null,8,["label","value"]))),128)):L("",!0)]),_:1},8,["modelValue","loading"])]),_:1}),e(t,null,{default:s(()=>[e(B,{type:"primary",onClick:D},{default:s(()=>[x("注册")]),_:1})]),_:1}),e(t,null,{default:s(()=>[e(E,{to:"/signin",class:"link"},{default:s(()=>[x("已有账号？点此登录")]),_:1})]),_:1})]),_:1},8,["model"])],64)}}});const X=H(Q,[["__scopeId","data-v-aef7e71d"]]);export{X as default};