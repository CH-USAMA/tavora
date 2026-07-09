export interface CartItem {
    productId: string;
    slug: string;
    title: string;
    price: number;
    image: string | null;
    quantity: number;
}
