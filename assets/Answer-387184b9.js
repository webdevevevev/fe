import{P as n}from"./Post-07ae741f.js";import{d as c,r as _,E as d,c as i,H as p,n as u,U as l,o as m,_ as f}from"./index-711f5c83.js";const w=c({__name:"Answer",props:{id:{}},setup(o){const a=o,r=_(new p);r.id=Number(a.id);async function t(e){const s=await u(e.id);s.user=new l,s.user.id=s.userId,delete s.userId,Object.assign(e,s)}return t(r).catch(e=>{d.error({showClose:!0,message:e.message}),console.error(e)}),(e,s)=>(m(),i(n,{base:r,class:"post"},null,8,["base"]))}});const v=f(w,[["__scopeId","data-v-125c79d5"]]);export{v as default};