export const endpoints = {
    auth: {
        googleLogin: '/auth/redirect',
        googleCallback: '/auth/callback',
        login: '/auth/login',
        logout: '/auth/logout',
        profile: '/auth/profile',
        register: '/auth/register',
        sendOtp: '/auth/send-otp',
        checkOtp: '/auth/check-otp',
        resetPassword: '/auth/reset-password',
        updateProfile: '/auth/update-profile',
        changePassword: '/auth/change-password',
    },
    settings: '/settings',
    contacts: '/contacts',
    orders: '/orders',
    wishlist: '/products/wishlist',
    cart: {
        add: '/carts',
        clear: '/carts',
        updateItem: (id: number) => `/carts-items/${id}`,
        removeItem: (id: number) => `/carts-items/${id}`,
    },
    payment: {
        pay: '/payment/pay',
        callback: '/payment/callback',
    }
};