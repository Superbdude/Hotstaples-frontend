export const money=(value:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(value);
export const orderStatuses=["Order Placed","Confirmed","Processing","Ready for Delivery","Out for Delivery","Delivered"] as const;
export const makeOrderId=(count:number)=>{const d=new Date();return `HOT-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${String(count+1).padStart(3,"0")}`};
export function safeRead<T>(key:string,fallback:T):T{if(typeof window==="undefined")return fallback;try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
