// "use client"

// import { useProductDetail } from "@/hooks/open/useProductDetail";
// import { useParams } from "next/navigation";
// import { useCallback, useState } from "react";
// import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Box, Home, Plus, Minus } from "lucide-react";
// import Link from "next/link";
// import RelatedProduct from "@/components/open/products/relatedProduct";
// import { useCart } from "@/hooks/open/useCart";
// import { useTranslations } from "next-intl";
// import WishlistButton from "@/components/open/wishlists/WishlistButton";
// import { NotFound } from "@/components/open/productDetails/NotFound";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import toast from "react-hot-toast";

// const PLACEHOLDER_IMAGE = "https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image";

// export default function ProductDetailPage() {
//    const t = useTranslations('ProductDetail');
  
//   const params = useParams();
//   const slug = params.slug as string;
//   const { product, loading, error } = useProductDetail(slug);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
//   const [quantity, setQuantity] = useState(1);

//   const { addToCart, getItemQuantity } = useCart();

//    const handleAddToCart = useCallback(async () => {
//     if (!product) return;
//   try {
//     await addToCart(product.id, quantity);
//     setQuantity(1);
//     toast.success("Product added to cart!"); 
//   } catch (error) {
//     toast.error("Error adding product to cart!");
//   }
// }, [addToCart, product?.id, quantity]); 


//   if (loading) {
//     return (
//       <LoadingSpinner/>
//     );
//   }

//   if (error || !product) {
//     return (
//       <NotFound/>
//     );
//   }

//   const currentInCart = getItemQuantity(product.id);
//   const availableStock = Math.max(0, product.stock - currentInCart);
//   const isOutOfStock = availableStock <= 0;
  

//    const allImages = product.images?.map(img => img.imageUrl) || [];
//   if (product.mainImage && !allImages.includes(product.mainImage)) {
//     allImages.unshift(product.mainImage);
//   }

 

//   const mainImageSrc = imageErrors['main'] 
//     ? PLACEHOLDER_IMAGE 
//     : (allImages[selectedImage] || product.mainImage || PLACEHOLDER_IMAGE);

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         {/* Breadcrumb */}
//         <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 ">
//            <Link href="/" className="hover:text-pink-600">{t('breadcrumb.home')}</Link>
//           <span className="mx-2">/</span>
//           <Link href="/products" className="hover:text-pink-600">{t('breadcrumb.products')}</Link>
//           <span className="mx-2">/</span>
//           <span className="text-gray-900 dark:text-white">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             <div className="relative  aspect-square overflow-hidden group">
//               <img
//                 src={mainImageSrc}
//                 onError={() => setImageErrors(prev => ({...prev, main: true}))}
//                 alt={product.name}
//                 className="object-cover w-full h-full scale-100 transition"
//               />
              
//               {/* Discount Badge */}
//               {product.isOnSale && product.salePrice && (
//                 <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-lg shadow-lg">
//                   -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
//                 </div>
//               )}

//               {/* Navigation Arrows */}
//               {allImages.length > 1 && (
//                 <>
//                   <button
//                     onClick={() => {
//                       setSelectedImage(prev => 
//                         prev === 0 ? allImages.length - 1 : prev - 1
//                       );
//                     }}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedImage(prev => 
//                         prev === allImages.length - 1 ? 0 : prev + 1
//                       );
//                     }}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnails */}
//             {allImages.length > 1 && (
//               <div className="grid grid-cols-5 gap-2">
//                 {allImages.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImage(idx)}
//                     className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
//                       selectedImage === idx 
//                         ? 'border-pink-600' 
//                         : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
//                     }`}
//                   >
//                     <img
//                       src={imageErrors[`thumb-${idx}`] ? PLACEHOLDER_IMAGE : img}
//                       alt={`${product.name} ${idx + 1}`}
                      
//                       onError={() => setImageErrors(prev => ({...prev, [`thumb-${idx}`]: true}))}
//                       className="object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info - rest of your code stays exactly the same */}
//           <div className="space-y-6">
//             <p className="text-sm text-pink-600 dark:text-pink-400 uppercase tracking-wider">
//               {product.categoryName}
//             </p>

//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
//               {product.name}
//             </h1>

//             <div className="flex items-center gap-4">
//               {product.isOnSale && product.salePrice ? (
//                 <>
//                   <span className="text-3xl font-bold text-red-600 dark:text-red-400">
//                     ${product.salePrice.toFixed(2)}
//                   </span>
//                   <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-3xl font-bold text-gray-900 dark:text-white">
//                   ${product.price.toFixed(2)}
//                 </span>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               {product.stock > 0 ? (
//                 <>
//                   <span className="w-2 h-2 bg-green-500 rounded-full" />
//                   <span className="text-green-600 dark:text-green-400">
//                      {t('labels.inStock', { count: product.stock })}
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <span className="w-2 h-2 bg-red-500 rounded-full" />
//                   <span className="text-red-600 dark:text-red-400">{t('labels.outOfStock')}</span>
//                 </>
//               )}
//             </div>

//             {product.description && (
//               <div className="pt-4">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                    {t('labels.description')} 
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
//                   {product.description}
//                 </p>
//               </div>
//             )}
            
//               <div className="pt-4">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   {t('labels.quantity')} 
//                 </label>
//                 <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-sm overflow-hidden w-fit">
//                   <button
//                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                     className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-darkbg transition"
//                   >
//                     <Minus/>
//                   </button>
//                   <span className="px-4 py-2 text-gray-900 dark:text-white min-w-13 text-center">
//                     {quantity}
//                   </span>
//                   <button
//                     onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
//                     disabled={quantity === product.stock || isOutOfStock}
//                     className={`px-4 ${isOutOfStock ? 'cursor-not-allowed ' : ''} py-2  hover:bg-gray-100 dark:hover:bg-darkbg transition`}
//                   >
//                     <Plus/>
//                   </button>
//                 </div>
//               </div>
           

//             <div className="flex gap-4 pt-6">
//               <button
//                 onClick={handleAddToCart}
//                 // disabled={product.stock <= quantity}P

//                 className="flex-1 bg-black cursor-pointer text-white px-6 py-3 rounded-sm hover:bg-gray-800 dark:bg-black/80 dark:hover:bg-black/60 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 {t('labels.addToCart')}
//               </button>
              
//               <div className="p-3 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-sm hover:bg-gray-100 hover:dark:bg-zinc-950 transition">
//                 <WishlistButton productId={product.id} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {product && (
//           <RelatedProduct productId={product.id} initialSize={4}  />
//         )}
//       </div>
//     </div>
//   );
// }