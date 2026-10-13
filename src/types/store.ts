export type Gender = "Women" | "Men" | "Unisex";
export type Family = "Floral" | "Woody" | "Oriental" | "Fresh" | "Gourmand";
export type Department = "Perfumes" | "Clothing" | "Bags" | "Shoes";
export type OrderStatus = "Order Placed" | "Confirmed" | "Processing" | "Ready for Delivery" | "Out for Delivery" | "Delivered";
export type ProductImage = "blush" | "noir" | "clothing" | "bag" | "shoe";
export interface Product { id:string; brand:string; name:string; description:string; price:number; department:Department; category:string; gender:Gender; family?:Family; material?:string; rating:number; reviews:number; stock:number; sizes:string[]; featured:boolean; bestseller:boolean; isNew:boolean; popularity:number; image:ProductImage; imageUrl?:string; notes?:{top:string[];heart:string[];base:string[]}; longevity?:string;sillage?:string; }
export interface CartItem { productId:string; quantity:number; size:string; }
export interface Address { firstName:string; lastName:string; email:string; phone:string; address:string; city:string; state:string; postalCode:string; country:string; }
export interface Order { id:string; date:string; items:Array<CartItem & {name:string;brand:string;price:number;image:ProductImage;department:Department}>; subtotal:number;shipping:number;total:number;status:OrderStatus;address:Address; paymentStatus?: "pending"|"paid"|"failed"; payment?: { reference?:string; method?:string; amount?:number; currency?:string; paidAt?:string|null }; }
