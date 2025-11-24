import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product) => {
                try {
                    if (!product || !product.id) {
                        console.error("Invalid product:", product);
                        return;
                    }
                    const currentItems = get().items || [];
                    const existingItemIndex = currentItems.findIndex(
                        (item) => item.producto && item.producto.id === product.id
                    );
                    let newItems;
                    if (existingItemIndex >= 0) {
                        const updatedItems = [...currentItems];
                        updatedItems[existingItemIndex].cantidad += 1;
                        newItems = updatedItems;
                    } else {
                        newItems = [
                            ...currentItems,
                            { producto: product, cantidad: 1 },
                        ];
                    }
                    // Actualizar items y abrir el carrito automáticamente
                    set({ items: newItems, isOpen: true });
                } catch (error) {
                    console.error("Error in addItem:", error);
                }
            },
            removeItem: (productId) => {
                const currentItems = get().items || [];
                const existingItemIndex = currentItems.findIndex(
                    (item) => item.producto && item.producto.id === productId
                );
                if (existingItemIndex >= 0) {
                    const updatedItems = [...currentItems];
                    if (updatedItems[existingItemIndex].cantidad > 1) {
                        updatedItems[existingItemIndex].cantidad -= 1;
                    } else {
                        updatedItems.splice(existingItemIndex, 1);
                    }
                    set({ items: updatedItems });
                }
            },
            deleteItem: (productId) => {
                const currentItems = get().items || [];
                set({
                    items: currentItems.filter(
                        (item) => item.producto && item.producto.id !== productId
                    ),
                });
            },
            clearCart: () => {
                set({ items: [] });
            },
            getTotal: () => {
                const items = get().items || [];
                return items.reduce((total, item) => {
                    if (item.producto && item.producto.precio && item.cantidad) {
                        return total + item.producto.precio * item.cantidad;
                    }
                    return total;
                }, 0);
            },
            getTotalItems: () => {
                const items = get().items || [];
                return items.reduce(
                    (total, item) => total + (item.cantidad || 0),
                    0
                );
            },
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => {
                const currentState = get();
                set({ isOpen: !currentState.isOpen });
            },
            getOrderData: () => {
                const items = get().items || [];
                const total = get().getTotal();
                return {
                    productos: items
                        .filter((item) => item.producto)
                        .map((item) => ({
                            id: item.producto.id,
                            nombre: item.producto.nombre,
                            precio: item.producto.precio,
                            cantidad: item.cantidad,
                        })),
                    total: total,
                    fecha: new Date().toISOString(), //Timestamp ISO8601
                };
            },
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({ items: state.items || [] }),
            // Asegurar que los datos cargados sean válidos
            merge: (persistedState, currentState) => {
                const items = persistedState?.items;
                return {
                    ...currentState,
                    items: Array.isArray(items) ? items : [],
                };
            },
        }
    )
);
