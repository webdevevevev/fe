import{P as r}from"./Post-8fbe151a.js";import{d as c,r as _,c as i,H as d,n as p,U as u,o as f,_ as l}from"./index-f000c5d8.js";const m=c({__name:"Answer",props:{id:{}},setup(n){const t=n,s=_(new d);s.id=Number(t.id);async function o(a){const e=await p(a.id);e.user=new u,e.user.id=e.userId,delete e.userId,Object.assign(a,e)}return o(s),(a,e)=>(f(),i(r,{base:s,class:"post"},null,8,["base"]))}});const v=l(m,[["__scopeId","data-v-eaab042c"]]);export{v as default};
