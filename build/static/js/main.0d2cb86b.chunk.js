(this.webpackJsonpbloglist_frontend=this.webpackJsonpbloglist_frontend||[]).push([[0],{22:function(e,t,n){},24:function(e,t,n){},42:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n(2),s=n(16),a=n.n(s),i=(n(22),n(3)),u=n.n(i),o=n(5),l=n(4),j=(n(24),n(6)),b=n.n(j),p=function(){return b.a.get("/api/blogs").then((function(e){return e.data}))},d=function(e){var t=e.blog;return Object(r.jsxs)("div",{className:"card blog",children:[Object(r.jsx)("h2",{children:t.title}),Object(r.jsx)("h3",{children:t.author}),Object(r.jsxs)("p",{children:["URL: ",t.url]}),Object(r.jsxs)("p",{children:["Likes: ",t.likes]})]})},f=function(){return Object(r.jsx)("div",{children:Object(r.jsxs)("form",{children:["Title",Object(r.jsx)("input",{type:"text"}),"Url",Object(r.jsx)("input",{type:"text"}),"Likes",Object(r.jsx)("input",{type:"text"})]})})},O={login:function(){var e=Object(o.a)(u.a.mark((function e(t){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.a.post("/api/login",t);case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},h=function(){var e=Object(c.useState)([]),t=Object(l.a)(e,2),n=t[0],s=t[1],a=Object(c.useState)(""),i=Object(l.a)(a,2),j=i[0],b=i[1],h=Object(c.useState)(""),x=Object(l.a)(h,2),g=x[0],v=x[1],m=Object(c.useState)(null),w=Object(l.a)(m,2),y=w[0],k=w[1];Object(c.useEffect)((function(){p().then((function(e){return s(e)})).catch((function(e){console.log(e)}))}),[]);var S=function(){var e=Object(o.a)(u.a.mark((function e(t){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.prev=1,e.next=4,O.login({username:j,password:g});case 4:n=e.sent,window.localStorage.setItem("loggedBlogUser",JSON.stringify(n)),k(n),v(""),b(""),setTimeout((function(){window.localStorage.clear()}),1e5),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),console.log(e.t0);case 15:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(t){return e.apply(this,arguments)}}();return Object(r.jsxs)("div",{className:"front",children:[null===y?Object(r.jsxs)("form",{onSubmit:S,children:[Object(r.jsx)("h2",{children:"Login"}),Object(r.jsxs)("div",{children:["username",Object(r.jsx)("input",{type:"text",value:j,name:"Username",onChange:function(e){var t=e.target;return b(t.value)}})]}),Object(r.jsxs)("div",{children:["password",Object(r.jsx)("input",{type:"password",value:g,name:"Password",onChange:function(e){var t=e.target;return v(t.value)}})]}),Object(r.jsx)("button",{type:"submit",children:"login"})]}):Object(r.jsx)(f,{}),Object(r.jsx)("div",{children:n.map((function(e){return Object(r.jsx)(d,{blog:e},e.id)}))})]})};a.a.render(Object(r.jsx)(h,{}),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.0d2cb86b.chunk.js.map