export interface VesperUserContext {
    currentPage?: string;
    currentProductId?: string;
    cartItems?: string[];
    savedRituals?: string[];
    recentSearches?: string[];
    localTime?: string;
}
export declare class ContextManager {
    formatContext(context: VesperUserContext): string;
}
