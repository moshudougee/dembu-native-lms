import { Course } from "@/types/types";
import { create } from "zustand";

interface WishlistState {
    wishlist: Course[];
    addToWishlist: (course: Course) => void;
    removeFromWishlist: (courseId: number) => void;
    isInWishlist: (courseId: number) => boolean;
}

export const useWishlistStore = create<WishlistState> ((set, get) => ({
    wishlist: [],
    addToWishlist: (course) => set(state => ({wishlist: [...state.wishlist, course] })),
    removeFromWishlist: (courseId) => set(state => ({wishlist: state.wishlist.filter(c => c.id!== courseId) })),
    isInWishlist: (courseId) => get().wishlist.some(c => c.id === courseId),  // Using some() to check if the course exists in the wishlist array.  // This is a more efficient way to check for existence than filtering the array.  // If you need to filter the array, you can use filter() instead.  // But in this case, using some() is more efficient.  // Note: this function will not work correctly if the course object has a different structure.  // For example, if the course object has a different property name for 'id'.  // You
}))